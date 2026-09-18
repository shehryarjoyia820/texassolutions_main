# Deployment

Two targets are supported from the same codebase.

| Target | Build | What you get |
| --- | --- | --- |
| Vercel | `npm run build` | Full Next.js, working `/api/submit` route, image optimisation |
| DreamHost shared | `npm run build:static` | Static HTML in `./out`, forms via `api/submit.php` |

---

## 1. Vercel

Vercel is the recommended primary host. It runs the Next.js server, so the form endpoint, image
optimisation and future server features all work.

### First deploy

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project**, import `shehryarjoyia820/texassolutions_main`.
3. Leave the framework preset on **Next.js**. No build command override is needed.
4. Add the environment variables below, then deploy.

### Environment variables

All optional. The site builds and runs without any of them; forms are logged rather than delivered.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sends the internal notification and the visitor auto-reply |
| `FROM_EMAIL` | Verified sender, e.g. `Texas Solutions <noreply@texassolutions.co>` |
| `NOTIFY_EMAIL` | Internal recipient, defaults to `sales@texassolutions.co` |
| `CRM_WEBHOOK_URL` | HubSpot, Zoho or GoHighLevel inbound webhook |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server-side verification |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget key |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity |

Leave `NEXT_PUBLIC_FORM_ENDPOINT` **unset** on Vercel so forms use the built-in route handler.

### Custom domain

1. Add `texassolutions.co` in **Project → Settings → Domains**.
2. Point DNS at Vercel. If Cloudflare is in front, set the records to **DNS only** (grey cloud) for
   the initial certificate issue, then re-enable proxying if you want it.
3. Update `SITE.url` in `src/data/site.ts` if the production domain differs. It drives canonical
   URLs, Open Graph tags, the sitemap and JSON-LD.

---

## 2. DreamHost shared hosting

DreamHost shared plans have no Node runtime, so the site is deployed as static HTML with a small PHP
script handling form submissions.

### Build

```bash
npm run build:static
```

This writes `./out`. The script temporarily moves `src/app/api` aside, because Next.js cannot export
a POST route handler, then restores it. **Stop the dev server first** — Windows will not let the
folder be moved while it is being watched.

### Upload

Copy the **contents** of `out/` into your DreamHost web directory, usually
`~/texassolutions.co/`. Include the hidden `.htaccess` file, which the build copies in from
`deploy/dreamhost/.htaccess`.

Over SFTP, or from a machine with SSH access:

```bash
rsync -avz --delete out/ USER@SERVER:~/texassolutions.co/
```

`--delete` removes files from previous deploys. Leave it off for the first upload if anything else
already lives in that directory.

### Configure the form endpoint

The PHP script reads its settings from a `config.php` next to it, so credentials stay out of git.
Create `api/config.php` on the server:

```php
<?php
return [
    'notify_email'     => 'sales@texassolutions.co',
    'from_email'       => 'noreply@texassolutions.co',
    'crm_webhook_url'  => '',
    'turnstile_secret' => '',
    'storage_dir'      => '/home/USER/ts-form-storage',
];
```

Two things matter on DreamHost:

- `from_email` must be an address on a domain hosted in the same account, or outbound mail is
  rejected.
- `storage_dir` must be **outside** the web directory and writable. It holds the rate-limit files
  and a submission log that acts as a backstop if email fails.

Then build with the endpoint pointed at PHP:

```bash
NEXT_PUBLIC_FORM_ENDPOINT=/api/submit.php npm run build:static
```

On Windows PowerShell:

```powershell
$env:NEXT_PUBLIC_FORM_ENDPOINT="/api/submit.php"; npm run build:static
```

The build script already defaults to `/api/submit.php`, so setting it explicitly is belt and braces.

### DreamHost panel settings

1. **Domains → Manage Domains → Edit** for your domain.
2. Turn on **HTTPS (Let's Encrypt)**. The `.htaccess` forces HTTPS, so the certificate must exist or
   visitors hit a redirect loop.
3. Set PHP to 8.1 or newer.
4. Leave "Remove WWW" alone; the `.htaccess` already strips it. If you prefer the `www` hostname,
   delete that block from `.htaccess` before uploading.

### Verify after upload

- `https://texassolutions.co/` loads over HTTPS with no mixed content.
- `https://texassolutions.co/services/truck-dispatch/` resolves without a trailing-slash redirect loop.
- `https://texassolutions.co/sitemap.xml` and `/robots.txt` are served.
- A test contact form submission arrives, and a line appears in `storage_dir/submissions.log`.
- A deliberately wrong URL renders the animated 404.

---

## Which host should be primary?

Run Vercel as production and DreamHost as either a mirror or the host of record with Vercel as the
build target, but **not both serving the same domain**. Two live copies of the same site will split
analytics and can create duplicate-content signals in search.

If DreamHost must be the public host, point the domain there and keep Vercel for preview deploys on
its own `*.vercel.app` URL, which is excluded from indexing by Vercel's own headers.

---

## Redeploying

| Host | Command |
| --- | --- |
| Vercel | `git push` — deploys automatically from the connected branch |
| DreamHost | `npm run build:static` then rsync or SFTP `out/` again |

Content changes live in `src/data`, so a copy edit is a code change and a redeploy until a CMS is
connected. `README.md` explains how to swap the data modules for a headless CMS without touching the
rest of the application.
