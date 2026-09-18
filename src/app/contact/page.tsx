import { Suspense } from 'react';
import { Clock, Handshake, LifeBuoy, Mail, MapPin, Megaphone, Phone } from 'lucide-react';
import { OFFICES, SITE } from '@/data/site';
import { PageHero } from '@/components/page-shell';
import { Container, Section, SectionHeading, NoteBox, ButtonLink, ArrowLink } from '@/components/ui';
import { ContactFormPanel } from '@/components/pages/contact-form-panel';
import { BookingWidget } from '@/components/booking';
import { RevealGroup, RevealItem } from '@/components/motion';
import { JsonLd, breadcrumbSchema, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Contact us',
  description:
    'Talk to a named person rather than a queue. Contact form, consultation booking with a time-zone picker, offices across five countries and a 24/7 dispatch line.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Contact us', href: '/contact' }])} />

      <PageHero
        eyebrow="Contact"
        title="Talk to a person, not a queue"
        body="Every enquiry reaches a named person. First reply within four business hours, and the dispatch line answers around the clock in under ninety seconds."
        trail={[{ label: 'Contact us' }]}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-3 rounded-xl border border-line bg-bg-elev p-4 transition-colors hover:border-accent/50"
          >
            <Phone className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="block text-xs text-fg-subtle">Call us</span>
              <span className="block text-sm font-medium">{SITE.phone}</span>
            </span>
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-3 rounded-xl border border-line bg-bg-elev p-4 transition-colors hover:border-accent/50"
          >
            <Mail className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="block text-xs text-fg-subtle">Email us</span>
              <span className="block text-sm font-medium">{SITE.email}</span>
            </span>
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-bg-elev p-4">
            <Clock className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="block text-xs text-fg-subtle">Hours</span>
              <span className="block text-sm font-medium">Dispatch 24/7</span>
            </span>
          </div>
        </div>
      </PageHero>

      {/* ---- Form and booking ---- */}
      <Section id="form">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="Send an enquiry"
                title="Tell us the situation"
                body="The more concrete the problem, the more useful the first reply. Nobody here needs a formal brief."
              />
              <div className="mt-8 rounded-2xl border border-line bg-bg-elev p-6 sm:p-8">
                <Suspense fallback={<p className="text-sm text-fg-subtle">Loading form…</p>}>
                  <ContactFormPanel />
                </Suspense>
              </div>
            </div>

            <div id="booking" className="lg:pt-[7.5rem]">
              <BookingWidget />
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Offices ---- */}
      <Section tone="soft" id="offices">
        <Container>
          <SectionHeading
            eyebrow="Offices"
            title="Five locations, four time zones"
            body="Dispatch is covered across Houston and Lahore, which is how the desk stays open overnight."
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICES.map((o) => (
              <RevealItem key={o.city}>
                <div className="h-full rounded-2xl border border-line bg-bg-elev p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold">{o.city}</h3>
                      <p className="text-sm text-fg-subtle">{o.country}</p>
                    </div>
                    <MapPin className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  </div>
                  <address className="mt-4 text-sm not-italic leading-relaxed text-fg-muted">
                    {o.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  {o.phone && (
                    <a href={SITE.phoneHref} className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
                      <Phone className="h-3.5 w-3.5" aria-hidden />
                      {o.phone}
                    </a>
                  )}
                  <p className="mt-3 text-xs text-fg-subtle">{o.focus}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <NoteBox className="mt-8">
            An embedded map is added once the exact suite numbers are confirmed for each location. Directions
            are sent with every meeting confirmation in the meantime.
          </NoteBox>
        </Container>
      </Section>

      {/* ---- Support, advertise, partner ---- */}
      <Section>
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <div id="support" className="rounded-2xl border border-line bg-bg-elev p-7">
              <LifeBuoy className="h-6 w-6 text-accent" aria-hidden />
              <h2 className="mt-4 font-display text-lg font-semibold">Support</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Existing clients: critical production incidents get a response within one hour, any day.
                Standard tickets are resolved within two business days.
              </p>
              <a
                href={`mailto:${SITE.supportEmail}`}
                className="mt-4 inline-block text-sm text-accent underline underline-offset-4"
              >
                {SITE.supportEmail}
              </a>
              <p className="mt-3 text-xs text-fg-subtle">
                Carriers with a truck down should call rather than email. The line is staffed overnight.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-bg-elev p-7">
              <Megaphone className="h-6 w-6 text-accent" aria-hidden />
              <h2 className="mt-4 font-display text-lg font-semibold">Advertise with us</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Banner, in-article, sponsored post, newsletter and guide sponsorship across an audience that
                is close to half carriers and fleet decision makers.
              </p>
              <ArrowLink href="/advertise" className="mt-4">
                Audience stats and rate card
              </ArrowLink>
            </div>

            <div id="partner" className="rounded-2xl border border-line bg-bg-elev p-7">
              <Handshake className="h-6 w-6 text-accent" aria-hidden />
              <h2 className="mt-4 font-display text-lg font-semibold">Partner with us</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Referral partnerships for agencies without a dispatch or QA arm, and delivery partnerships
                where you need capacity under your own brand.
              </p>
              <ButtonLink href="/contact?subject=partnership" variant="secondary" size="sm" className="mt-4">
                Discuss a partnership
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
