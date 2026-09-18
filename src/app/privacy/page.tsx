import { SITE, OFFICES } from '@/data/site';
import { PageHero } from '@/components/page-shell';
import { ScrollProgress } from '@/components/motion';
import { Container, Section, NoteBox } from '@/components/ui';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Privacy policy',
  description:
    'What data Texas Solutions collects, why, how long we keep it, and your rights under CCPA, other US state laws and UK and EU GDPR.',
  path: '/privacy',
});

const UPDATED = 'September 18, 2026';

export default function PrivacyPage() {
  return (
    <>
      <ScrollProgress />
      <JsonLd data={breadcrumbSchema([{ label: 'Privacy policy', href: '/privacy' }])} />

      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        body={`How we collect, use and delete personal data. Last updated ${UPDATED}.`}
        trail={[{ label: 'Privacy policy' }]}
      />

      <Section>
        <Container>
          <NoteBox tone="warn" className="mx-auto mb-10 max-w-prose">
            This policy is a thorough working draft written by the development team. It must be reviewed by a
            qualified lawyer in each market before launch. Do not publish it as final legal text without that
            review.
          </NoteBox>

          <div className="prose-ts mx-auto">
            <h2>Who we are</h2>
            <p>
              {SITE.legalName} operates {SITE.url} and provides truck dispatch, web and app development, lead
              generation, advertising, AdSense revenue management, quality assurance testing and auto engine
              supply. Our head office is at {OFFICES[0].address.slice(1).join(', ')}. For any privacy question
              or request, contact <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phone}.
            </p>

            <h2>What we collect</h2>
            <h3>Information you give us</h3>
            <ul>
              <li>Contact details: name, email address, telephone number and company name.</li>
              <li>Enquiry content: what you type into a contact, estimate, application or enquiry form.</li>
              <li>Estimate inputs: the region, service, scope answers and timeline you select in the calculator.</li>
              <li>Booking details: your chosen slot, duration and time zone.</li>
              <li>Application details: role applied for, links you provide and anything in your message.</li>
            </ul>

            <h3>Information collected automatically</h3>
            <ul>
              <li>Usage data: pages viewed, time on page, referring site and approximate location from your IP address.</li>
              <li>Device data: browser, operating system and screen size.</li>
              <li>Marketing attribution: UTM parameters and click identifiers present in the URL you arrived on.</li>
            </ul>
            <p>
              Analytics cookies are not set until you accept them in the cookie banner. If you decline, only
              cookies strictly necessary for the site to function are used, and your theme and region
              preferences are stored in your browser rather than sent to us.
            </p>

            <h3>Information from clients we work for</h3>
            <p>
              Delivering our services can involve access to client systems containing personal data, for
              example a CRM during a lead generation engagement or an ad account during a campaign. In those
              cases we act as a processor on the client instruction, under a written agreement, and we do not
              use that data for our own purposes.
            </p>

            <h2>Why we use it, and our legal basis</h2>
            <ul>
              <li><strong>To respond to your enquiry.</strong> Necessary to take steps at your request before entering a contract.</li>
              <li><strong>To deliver services you have bought.</strong> Performance of a contract.</li>
              <li><strong>To send you the newsletter or a requested download.</strong> Your consent, withdrawable at any time.</li>
              <li><strong>To improve the site and measure marketing.</strong> Our legitimate interests, and your consent where cookies are involved.</li>
              <li><strong>To meet legal, tax and accounting obligations.</strong> Compliance with a legal obligation.</li>
              <li><strong>To prevent fraud and abuse of our forms.</strong> Our legitimate interests in keeping the service secure.</li>
            </ul>

            <h2>Calls and text messages</h2>
            <p>
              Where a form asks for consent to be contacted by phone or text message, that consent is express
              written consent for the purposes of the US Telephone Consumer Protection Act. It is not a
              condition of purchase. You can withdraw it at any time by replying STOP to a message, telling us
              on a call, or emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Message and data rates
              may apply. We keep a record of the consent, including when and where it was given.
            </p>

            <h2>Cookies and similar technologies</h2>
            <ul>
              <li><strong>Strictly necessary.</strong> Keep the site working, remember your cookie choice, and protect forms from abuse. These cannot be switched off.</li>
              <li><strong>Preference.</strong> Your theme and region, stored locally in your browser and never transmitted to us.</li>
              <li><strong>Analytics.</strong> Google Analytics 4 and Microsoft Clarity, used to understand which pages produce enquiries. Set only after you accept.</li>
              <li><strong>Advertising.</strong> Google Ads and Meta Pixel, used to measure campaign performance. Set only after you accept.</li>
            </ul>
            <p>
              You can change your choice at any time by clearing this site&rsquo;s data in your browser, which
              makes the consent banner appear again.
            </p>

            <h2>Who we share it with</h2>
            <p>We do not sell personal information. We share it only with:</p>
            <ul>
              <li><strong>Service providers</strong> who process data on our behalf under contract: our CRM, email delivery provider, hosting provider, analytics providers and spam protection service.</li>
              <li><strong>Professional advisers</strong> such as accountants and lawyers, where necessary.</li>
              <li><strong>Authorities</strong>, where we are legally required to do so.</li>
            </ul>
            <p>
              A current list of subprocessors, including what each one does and where it stores data, is
              available on request from <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>

            <h2>International transfers</h2>
            <p>
              We operate from the United States, United Kingdom, Canada, Australia and Pakistan. Personal data
              may therefore be transferred outside your country. Where data leaves the UK or EEA, transfers are
              made under Standard Contractual Clauses or the UK International Data Transfer Addendum, together
              with supplementary technical measures including encryption in transit and at rest.
            </p>

            <h2>How long we keep it</h2>
            <ul>
              <li>Enquiries and estimates that do not become clients: 24 months, then deleted.</li>
              <li>Client records: the duration of the engagement plus 7 years, for tax and accounting.</li>
              <li>Newsletter subscribers: until you unsubscribe, then a suppression record only.</li>
              <li>Job applications: 6 months, unless you ask us to keep them longer.</li>
              <li>Website analytics: 14 months.</li>
            </ul>

            <h2>Your rights</h2>
            <h3>If you are in the UK or the EEA</h3>
            <p>
              Under UK and EU GDPR you have the right to access your data, correct it, delete it, restrict or
              object to processing, receive it in a portable format, and withdraw consent at any time. You also
              have the right to complain to a supervisory authority, which in the UK is the Information
              Commissioner&rsquo;s Office.
            </p>

            <h3>If you are in California</h3>
            <p>
              Under the CCPA as amended by the CPRA you have the right to know what personal information is
              collected and how it is used, to delete it, to correct it, to opt out of sale or sharing, to
              limit the use of sensitive personal information, and not to be discriminated against for
              exercising these rights. We do not sell personal information and do not share it for
              cross-context behavioural advertising outside the analytics and advertising cookies you consent
              to.
            </p>

            <h3>If you are in another US state</h3>
            <p>
              Residents of Virginia, Colorado, Connecticut, Utah, Texas and other states with comprehensive
              privacy laws have broadly equivalent rights of access, correction, deletion, portability and
              opt-out. We apply the same process to every request regardless of where you live.
            </p>

            <h3>How to exercise a right</h3>
            <p>
              Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the request. We will verify your
              identity, usually by confirming details you have already given us, and respond within 30 days, or
              45 days for US state requests where the law allows. There is no charge unless a request is
              manifestly unfounded or excessive.
            </p>

            <h2>Security</h2>
            <p>
              We use HTTPS with HSTS across the site, encrypt lead data at rest, apply least-privilege
              role-based access to every system holding client data, review access quarterly and revoke it
              within one business day of someone leaving. Public forms carry rate limiting, server-side
              validation and a bot challenge. We have a written incident response process with a one-hour
              response target for critical issues and will notify you and the relevant regulator where the law
              requires it.
            </p>

            <h2>Children</h2>
            <p>
              This site is for businesses. We do not knowingly collect personal data from anyone under 16. If
              you believe a child has given us data, contact us and we will delete it.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We will update this page when our practices change and revise the date at the top. Material
              changes will be notified by email to anyone on our list.
            </p>

            <h2>Contact</h2>
            <p>
              {SITE.legalName}, {OFFICES[0].address.slice(1).join(', ')}.{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · {SITE.phone}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
