import { SITE, OFFICES } from '@/data/site';
import { PageHero } from '@/components/page-shell';
import { ScrollProgress } from '@/components/motion';
import { Container, Section, NoteBox } from '@/components/ui';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Terms of service',
  description:
    'The terms that govern use of texassolutions.co, our published pricing, the Rough Estimate calculator and our service agreements.',
  path: '/terms',
});

const UPDATED = 'September 18, 2026';

export default function TermsPage() {
  return (
    <>
      <ScrollProgress />
      <JsonLd data={breadcrumbSchema([{ label: 'Terms of service', href: '/terms' }])} />

      <PageHero
        eyebrow="Legal"
        title="Terms of service"
        body={`The terms governing this website and our engagements. Last updated ${UPDATED}.`}
        trail={[{ label: 'Terms' }]}
      />

      <Section>
        <Container>
          <NoteBox tone="warn" className="mx-auto mb-10 max-w-prose">
            This is a thorough working draft written by the development team. It must be reviewed by a
            qualified lawyer in each market before launch. Do not publish it as final legal text without that
            review.
          </NoteBox>

          <div className="prose-ts mx-auto">
            <h2>1. Who these terms are with</h2>
            <p>
              This website is operated by {SITE.legalName}, {OFFICES[0].address.slice(1).join(', ')}. By using
              the site you agree to these terms. If you do not agree, please do not use it.
            </p>

            <h2>2. Estimates are not quotes</h2>
            <p>
              Every price on this site, including the tables on the pricing page, the starting prices on
              service pages and the output of the Rough Estimate calculator, is a range published for guidance.
              It is an invitation to discuss work, not an offer capable of acceptance and not a binding quote.
            </p>
            <p>
              The calculator returns a low, likely and high figure derived from the answers you give and the
              published table for your region. It cannot see your actual requirements, your existing systems,
              your data quality or your constraints. Final pricing is confirmed only in a written proposal
              issued after a consultation, and that proposal governs if it differs from anything shown here.
            </p>
            <p>
              We reserve the right to change published ranges at any time. A range you saw previously does not
              bind us, and a saved or printed estimate is guidance for approximately 30 days.
            </p>

            <h2>3. Region and currency</h2>
            <p>
              Prices are shown in the currency of the region you select. Each region has its own authored price
              table. We do not convert currency live, and the figures shown in one region are not an exchange
              rate calculation of another. Canadian and European figures are derived from US and UK benchmarks
              and are marked as such on the pricing page.
            </p>

            <h2>4. Service agreements</h2>
            <p>
              Work is performed under a separate written agreement covering scope, price, timeline, acceptance
              criteria and service levels. Where these terms and a signed service agreement conflict, the
              service agreement governs.
            </p>
            <h3>Recurring services</h3>
            <p>
              Dispatch, retainers and managed services run month to month with 30 days notice in either
              direction and no termination fee, unless a signed agreement states otherwise. Fees are invoiced
              in advance unless agreed otherwise.
            </p>
            <h3>Dispatch fees specifically</h3>
            <p>
              Where a dispatch fee is charged as a percentage, it applies to linehaul revenue only. It does not
              apply to fuel surcharge, detention, layover, truck-order-not-used payments, lumper reimbursement
              or any other accessorial. Flat weekly fees are quoted per truck.
            </p>
            <h3>Project work</h3>
            <p>
              Fixed-scope projects are governed by the written scope and its acceptance criteria. Changes to
              scope are handled by written change order with their own price and timeline impact.
            </p>

            <h2>5. Intellectual property and ownership</h2>
            <p>
              On full payment, you own the deliverables we create for you: source code, design files, creative
              assets and test suites. Accounts we operate on your behalf, including advertising accounts,
              analytics properties and repositories, remain in your name throughout.
            </p>
            <p>
              We retain ownership of our pre-existing tools, libraries, frameworks and methods, and grant you a
              perpetual, non-exclusive licence to use them as embedded in your deliverables. Website content,
              branding and the design of this site remain ours.
            </p>

            <h2>6. Your responsibilities</h2>
            <ul>
              <li>Provide accurate information, including the figures you enter into the calculator.</li>
              <li>Hold the rights to any content, data or credentials you give us.</li>
              <li>Respond to requests for approval within agreed timeframes, since delays move delivery dates.</li>
              <li>Comply with the rules of any third-party platform we operate on your behalf.</li>
            </ul>

            <h2>7. Third-party platforms</h2>
            <p>
              Some services depend on platforms we do not control, including Google Ads, Google AdSense, Meta,
              TikTok, LinkedIn and freight load boards. We cannot guarantee approval, continued access,
              placement, policy outcomes or platform pricing. Where a platform suspends or restricts an account,
              we will support the appeal but cannot guarantee its result.
            </p>

            <h2>8. No guarantee of results</h2>
            <p>
              Case studies and metrics on this site describe outcomes achieved for specific clients in specific
              circumstances. They are not a prediction or a promise of what your engagement will produce.
              Revenue, ranking, lead volume, freight rates and advertising performance depend on factors
              outside our control.
            </p>

            <h2>9. Auto engines</h2>
            <p>
              Engine prices are ranges, subject to availability and confirmation against your vehicle
              identification number. Warranty terms are those of the supplier or remanufacturer and are
              provided in writing before purchase. Core charges are refunded when the original unit is returned
              in a rebuildable condition within the stated period. Installation is performed by vetted partner
              shops, and their workmanship warranty applies to the labour.
            </p>

            <h2>10. Limitation of liability</h2>
            <p>
              Nothing in these terms excludes liability for death or personal injury caused by negligence,
              fraud, or anything else that cannot lawfully be excluded. Subject to that, our total liability
              arising from an engagement is limited to the fees you paid us for that engagement in the twelve
              months before the claim, and we are not liable for indirect or consequential loss, loss of
              profit, loss of revenue or loss of data.
            </p>

            <h2>11. Confidentiality</h2>
            <p>
              Each party will keep the other&rsquo;s confidential information confidential and use it only to
              perform the engagement. This survives the end of the engagement. We will not name you as a client
              or publish results from your engagement without your written permission.
            </p>

            <h2>12. Acceptable use of this site</h2>
            <p>
              Do not attempt to gain unauthorised access, probe or scan the site, submit automated form
              submissions, scrape content at scale, or use the site to send unlawful or abusive material. We
              rate limit forms and may block access where we detect abuse.
            </p>

            <h2>13. Changes to these terms</h2>
            <p>
              We may update these terms. The version published here at the time you use the site is the one
              that applies, and material changes are notified to active clients in writing.
            </p>

            <h2>14. Governing law</h2>
            <p>
              These terms are governed by the laws of the State of Texas, United States, and the courts of
              Harris County, Texas have exclusive jurisdiction, except where the law of your country of
              residence gives you the right to bring proceedings elsewhere. Engagements contracted through our
              UK, Canadian or Australian entities may specify local law in the service agreement.
            </p>

            <h2>15. Contact</h2>
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
