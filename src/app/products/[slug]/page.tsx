import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as Icons from 'lucide-react';
import { ArrowRight, Check, type LucideIcon } from 'lucide-react';
import { PRODUCTS, PRODUCT_MAP } from '@/data/catalog';
import { SERVICES } from '@/data/services';
import { PageHero, CtaSection } from '@/components/page-shell';
import { Accordion, Badge, ButtonLink, Container, Section, SectionHeading, NoteBox } from '@/components/ui';
import { RevealGroup, RevealItem } from '@/components/motion';
import { JsonLd, breadcrumbSchema, faqSchema, pageMeta, productSchema } from '@/lib/seo';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCT_MAP[slug];
  if (!product) return {};
  return pageMeta({
    title: `${product.name} — ${product.tagline}`,
    description: product.summary,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCT_MAP[slug];
  if (!product) notFound();

  const Icon = (Icons[product.icon as keyof typeof Icons] ?? Icons.Box) as LucideIcon;
  const service = SERVICES.find((s) => s.slug === product.service);
  const accent = hexToTriplet(product.accentHex);

  const statusLabel =
    product.status === 'live' ? 'Available now' : product.status === 'beta' ? 'In beta' : 'Planned';

  return (
    <div style={{ ['--svc' as string]: accent }}>
      <JsonLd
        data={[
          productSchema(product),
          faqSchema(product.faqs),
          breadcrumbSchema([
            { label: 'Products', href: '/products' },
            { label: product.name, href: `/products/${product.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Product"
        title={product.name}
        body={product.tagline}
        trail={[{ label: 'Products', href: '/products' }, { label: product.name }]}
        accent={accent}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={product.status === 'live' ? 'success' : 'warn'}>{statusLabel}</Badge>
          <Badge tone="service">{product.category}</Badge>
          {service && (
            <Link
              href={`/services/${service.slug}`}
              className="text-sm text-fg-muted underline underline-offset-4 hover:text-svc"
            >
              Part of {service.navLabel}
            </Link>
          )}
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="mb-6 inline-grid h-14 w-14 place-items-center rounded-2xl border border-svc/30 bg-svc/10 text-svc">
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <p className="text-lg leading-relaxed text-fg">{product.description}</p>

              <h2 className="mt-12 text-display-sm">What it does</h2>
              <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.features.map((f) => (
                  <RevealItem key={f.title}>
                    <div className="h-full rounded-xl border border-line bg-bg-soft p-5">
                      <h3 className="font-display text-base font-semibold">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{f.body}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-line bg-bg-elev p-6">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  Who uses it
                </p>
                <ul className="mt-3.5 space-y-2">
                  {product.audience.map((a) => (
                    <li key={a} className="flex gap-2.5 text-sm text-fg-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-svc" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>

                <p className="mt-7 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  Works with
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {product.integrations.map((i) => (
                    <li key={i} className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-fg-subtle">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-2xl border border-svc/25 bg-svc/5 p-6">
                <p className="font-display text-lg font-semibold">{statusLabel}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {product.status === 'live'
                    ? 'Included with the service it supports. Ask us for a walkthrough on a call.'
                    : 'In beta with existing clients. Tell us your use case and we will say whether you can join.'}
                </p>
                <ButtonLink
                  href={`/contact?product=${product.slug}`}
                  variant="service"
                  className="mt-5 w-full"
                  arrow
                >
                  Request a walkthrough
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Questions" title={`About ${product.name}`} />
            <Accordion items={product.faqs} defaultOpen={0} />
          </div>
          <NoteBox className="mt-10">
            Screenshots and a live demo are shared during a call rather than published here, because most
            views contain real client data.
          </NoteBox>
        </Container>
      </Section>

      <CtaSection
        title={service ? `See it running on ${service.navLabel}` : 'See it running'}
        body="The fastest way to judge a tool is to watch someone use it on a real account. Book twenty minutes and we will do exactly that."
        primary={{ href: '/contact', label: 'Book a walkthrough' }}
        secondary={{ href: '/products', label: 'Back to products' }}
      />
    </div>
  );
}

function hexToTriplet(hex: string) {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0, 2), 16)} ${parseInt(c.slice(2, 4), 16)} ${parseInt(c.slice(4, 6), 16)}`;
}
