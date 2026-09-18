# Texas Solutions

The Texas Solutions corporate website: seven service lines, per-region pricing and an interactive
Rough Estimate calculator. Built from the v2 developer specification.

**Live targets:** GitHub Pages at texassolutions.co (static, deployed by GitHub Actions), Vercel (full Next.js, also serves the form endpoint) and DreamHost shared hosting (static export).

---

## Quick start

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build for Vercel or any Node host |
| `npm start` | Serve the production build |
| `npm run build:static` | Static export to `./out` for DreamHost shared hosting |
| `npm run lint` | ESLint via Next.js |

---

## What is built

**40 pages and 8 templates.** 116 routes are generated at build time.

- **Home** with an animated hero, pinned horizontal services scroll, industry switcher, interactive
  engagement-model calculator, mini estimate widget, case study carousel and FAQ.
- **Seven service pages**, each with its own accent colour, sub-service pages (54 in total),
  three-tier packages, process timeline, case study, FAQ and a bespoke interactive element.
- **Seven solution pages** bundling services by industry.
- **Six product pages** and a twelve-item marketplace, both enquiry-only.
- **Insights hub** with blog posts, case studies, gated guides, an industry report and an event.
- **Rough Estimate calculator**: a seven-step flow returning low, likely and high figures with a
  line-item breakdown, the assumptions used and a printable PDF.
- **Company pages**: Why Texas Solutions, About, Look Inside, Investors, Contact, Portfolio,
  Advertise, Pricing, privacy, terms and an animated 404.

---

## Architecture

```
src/
├── app/                 Routes (App Router). One folder per page.
│   └── api/submit/      Form endpoint used on Vercel only
├── components/
│   ├── motion.tsx       Reveal, SplitText, Counter, Magnetic, Tilt, Marquee, Lenis
│   ├── ui.tsx           Button, Section, Card, Accordion, Tabs, RangeBar, Breadcrumbs
│   ├── header.tsx       Ten-item mega-menu, region switcher, theme toggle
│   ├── forms.tsx        Every form, with consent wording and honeypot
│   ├── estimate/        The seven-step calculator and its PDF document
│   └── service-widgets.tsx  The seven per-service interactive elements
├── data/                All content. Typed, and shaped like the CMS models.
└── lib/                 Estimate engine, formatting, analytics, SEO, forms
```

### Content lives in `src/data`

Every content model named in the specification exists as a typed module: `service`, `subService`,
`solution`, `product`, `marketplaceItem`, `priceTable`, `caseStudy`, `article`, `job`, `teamMember`,
`testimonial`, `office`, `faq` and `estimateQuestionSet`.

There is no CMS wired up yet. The data modules are deliberately shaped so a headless CMS (Sanity,
Payload or Strapi) is a drop-in: replace each module's export with a fetch of the same shape and
nothing else in the application changes. Start with `src/data/pricing.ts` and
`src/data/estimate-config.ts`, which is what the client will want to edit first.

### Pricing and regions

Five regions each have their own **authored** price table. The switcher changes which row is read.
Currency is never converted at runtime, because a converted figure implies a precision these ranges
do not have. Canadian and European figures are scaled from US and UK benchmarks and are flagged as
derived on the pricing page.

### The estimate engine

`src/lib/estimate.ts` combines authored numbers only. It never invents a figure:

```
base range (price table row for the region)
  × select-answer factors
  + select-answer and per-unit additions
  × timeline multiplier (rush 1.30, standard 1.00, flexible 0.90)
  × duration in months for recurring services
```

Truck dispatch additionally returns both fee models side by side with the break-even weekly gross.
AdSense returns a revenue projection. Ads returns flat versus percentage-of-spend. Lead generation
returns a per-lead figure.

---

## Design system

Tokens are defined once in `tailwind.config.ts` and `src/app/globals.css` as CSS variables, so light
and dark themes swap with one class on `<html>`. Each service sets `--svc` to its own accent, which
every `svc`-prefixed utility on that page then reads.

- **Type**: Space Grotesk for display, Inter for body, both self-hosted through `next/font`.
- **Motion**: Lenis for smooth scroll, GSAP ScrollTrigger for the pinned services section, Framer
  Motion for reveals and transitions, CSS keyframes for marquees and headline stagger.
- **Rules**: only `transform` and `opacity` are animated, motion below the fold is lazy-loaded,
  pinning is disabled under 768px, and everything respects `prefers-reduced-motion`.
- **Breakpoints**: 360, 768, 1024, 1440, plus 1600 for the full-width header.

Headlines render as plain text on the server and animate after hydration, and a `<noscript>` rule
forces every revealed section visible, so no content depends on JavaScript.

---

## Forms

Every form posts JSON to one endpoint, set by `NEXT_PUBLIC_FORM_ENDPOINT`:

- **Vercel**: `/api/submit`, the route handler in `src/app/api/submit/route.ts`.
- **DreamHost**: `/api/submit.php`, shipped in `public/api/`.

Both apply a honeypot field, rate limiting, server-side validation, optional Cloudflare Turnstile
verification, an internal notification, an auto-reply and an optional CRM webhook. With no
integrations configured they accept the submission and log it, so the site works before the CRM and
email accounts exist.

Forms leading to calls or texts carry TCPA-compliant express written consent wording.

---

## Before launch

The specification forbids placeholder content, so anything awaiting client material is flagged in
the code rather than faked. See `CONTENT_TODO` in `src/data/company.ts`:

- [ ] Real leadership names, headshots and bios (role-only cards are shown today)
- [ ] Named client testimonials and logos, with written permission
- [ ] Office photography and the day-on-dispatch video
- [ ] Final package prices to replace the market benchmark ranges
- [ ] Legal review of the privacy policy and terms
- [ ] Verify the certification badges currently marked "in progress"

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel and DreamHost instructions.
