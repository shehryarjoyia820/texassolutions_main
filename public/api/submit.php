<?php
/**
 * Form endpoint for DreamHost shared hosting.
 *
 * The Next.js static export has no server runtime, so this small PHP script
 * receives every form submission instead. Point NEXT_PUBLIC_FORM_ENDPOINT at
 * /api/submit.php before running the static build.
 *
 * Edit the settings block below, or create api/config.php next to this file
 * returning the same keys so credentials stay out of version control.
 */

declare(strict_types=1);

$config = [
    // Internal recipient for every submission.
    'notify_email'    => 'info@texassolutions.co',
    // Must be an address on your own domain or DreamHost will reject the send.
    'from_email'      => 'noreply@texassolutions.co',
    'from_name'       => 'Texas Solutions Website',
    // Optional: HubSpot, Zoho or GoHighLevel inbound webhook URL.
    'crm_webhook_url' => '',
    // Optional: Cloudflare Turnstile secret key.
    'turnstile_secret'=> '',
    // Submissions per IP per minute.
    'rate_limit'      => 6,
    // Writable path for the rate-limit store and the submission log.
    'storage_dir'     => __DIR__ . '/../../ts-form-storage',
];

$localConfig = __DIR__ . '/config.php';
if (is_readable($localConfig)) {
    $config = array_merge($config, (array) require $localConfig);
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode((string) $raw, true);

if (!is_array($payload) || empty($payload['form'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request body.']);
    exit;
}

$form        = (string) $payload['form'];
$fields      = is_array($payload['fields'] ?? null) ? $payload['fields'] : [];
$attribution = is_array($payload['attribution'] ?? null) ? $payload['attribution'] : [];
$ip          = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip          = trim(explode(',', (string) $ip)[0]);

/* ---- honeypot: accept silently so bots learn nothing ---- */
if (!empty($fields['company_website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

/* ---- rate limit ---- */
if (!is_dir($config['storage_dir'])) {
    @mkdir($config['storage_dir'], 0750, true);
}
$rateFile = $config['storage_dir'] . '/rate-' . sha1($ip) . '.json';
$now = time();
$window = ['count' => 0, 'reset' => $now + 60];
if (is_readable($rateFile)) {
    $stored = json_decode((string) file_get_contents($rateFile), true);
    if (is_array($stored) && ($stored['reset'] ?? 0) > $now) {
        $window = $stored;
    }
}
$window['count']++;
@file_put_contents($rateFile, json_encode($window), LOCK_EX);

if ($window['count'] > (int) $config['rate_limit']) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Too many submissions. Please wait a minute.']);
    exit;
}

/* ---- optional Turnstile check ---- */
if (!empty($config['turnstile_secret'])) {
    $token = (string) ($payload['token'] ?? '');
    $verify = @file_get_contents(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        false,
        stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => http_build_query([
                    'secret'   => $config['turnstile_secret'],
                    'response' => $token,
                    'remoteip' => $ip,
                ]),
                'timeout' => 8,
            ],
        ])
    );
    $verified = json_decode((string) $verify, true);
    if (empty($verified['success'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Verification failed. Please try again.']);
        exit;
    }
}

/* ---- validate email if present ---- */
$email = isset($fields['email']) ? trim((string) $fields['email']) : '';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'That email address does not look valid.']);
    exit;
}

/* ---- build the notification ---- */
$rows = '';
foreach ($fields as $key => $value) {
    if ($key === 'company_website') {
        continue;
    }
    $printable = is_scalar($value) ? (string) $value : json_encode($value, JSON_UNESCAPED_SLASHES);
    $rows .= '<tr><td style="padding:4px 12px 4px 0;color:#667;vertical-align:top">'
        . htmlspecialchars((string) $key, ENT_QUOTES, 'UTF-8')
        . '</td><td style="padding:4px 0"><strong>'
        . nl2br(htmlspecialchars((string) $printable, ENT_QUOTES, 'UTF-8'))
        . '</strong></td></tr>';
}
foreach ($attribution as $key => $value) {
    $rows .= '<tr><td style="padding:4px 12px 4px 0;color:#99a">'
        . htmlspecialchars((string) $key, ENT_QUOTES, 'UTF-8')
        . '</td><td style="padding:4px 0;color:#667">'
        . htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8')
        . '</td></tr>';
}

$subject = 'New ' . $form . ' submission';
$body = '<h2 style="font-family:sans-serif">' . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . '</h2>'
    . '<table style="font-family:sans-serif;font-size:14px">' . $rows . '</table>';

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . $config['from_name'] . ' <' . $config['from_email'] . '>',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$sent = @mail($config['notify_email'], $subject, $body, implode("\r\n", $headers));

/* ---- auto-reply to the visitor ---- */
if ($email !== '') {
    $firstName = 'there';
    if (!empty($fields['name'])) {
        $parts = explode(' ', trim((string) $fields['name']));
        $firstName = $parts[0];
    }
    $replySubject = $form === 'estimate'
        ? 'Your rough estimate from Texas Solutions'
        : ($form === 'booking' ? 'Your consultation is booked' : 'We received your enquiry');

    $replyBody = '<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#12182a">'
        . '<p>Hi ' . htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8') . ',</p>'
        . '<p>Thanks for getting in touch with Texas Solutions. A named person on the relevant team has your '
        . 'message and will reply within four business hours on a working day.</p>'
        . '<p>If it is urgent, call us on (838) 910-3147. The dispatch desk is staffed around the clock.</p>'
        . '<p style="color:#667;font-size:13px">Any figures we have shown you are ranges for guidance only and '
        . 'are not a binding quote. Final pricing is confirmed after a consultation.</p>'
        . '<p>Texas Solutions</p></div>';

    @mail($email, $replySubject, $replyBody, implode("\r\n", [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $config['from_name'] . ' <' . $config['from_email'] . '>',
    ]));
}

/* ---- optional CRM webhook ---- */
if (!empty($config['crm_webhook_url'])) {
    @file_get_contents($config['crm_webhook_url'], false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\n",
            'content' => json_encode([
                'form'        => $form,
                'fields'      => $fields,
                'attribution' => $attribution,
                'ip'          => $ip,
                'receivedAt'  => gmdate('c'),
            ]),
            'timeout' => 8,
        ],
    ]));
}

/* ---- append to a local log as a backstop ---- */
@file_put_contents(
    $config['storage_dir'] . '/submissions.log',
    gmdate('c') . ' ' . json_encode(['form' => $form, 'fields' => $fields, 'ip' => $ip]) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

echo json_encode(['ok' => true, 'mailed' => (bool) $sent]);
