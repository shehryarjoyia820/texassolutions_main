import { cn } from '@/lib/utils';

/**
 * A realistic miniature of a website template, drawn in HTML so it stays
 * crisp at any size, themes with the item's accent and costs no image weight.
 * Replace with real screenshots once the templates have live demos.
 */

export type TemplateLayout = 'split' | 'centered' | 'dashboard' | 'listing' | 'store' | 'booking' | 'editorial';

export interface TemplatePreviewConfig {
  layout: TemplateLayout;
  brand: string;
  headline: string;
  sub?: string;
  cta?: string;
  nav?: string[];
  /** Light pages render on white, dark ones on near-black. */
  tone?: 'light' | 'dark';
  /** Second colour for gradients and highlights. */
  accent2?: string;
}

export function TemplatePreview({
  config,
  accent,
  className,
  chrome = true,
}: {
  config: TemplatePreviewConfig;
  accent: string;
  className?: string;
  chrome?: boolean;
}) {
  const dark = config.tone === 'dark';
  const accent2 = config.accent2 ?? accent;
  const ink = dark ? '#E8ECF6' : '#111827';
  const muted = dark ? 'rgba(232,236,246,0.55)' : 'rgba(17,24,39,0.5)';
  const surface = dark ? '#0B0F1C' : '#FFFFFF';
  const panel = dark ? '#141A2B' : '#F3F5F9';
  const line = dark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.08)';
  const nav = config.nav ?? ['Home', 'Services', 'About', 'Contact'];

  return (
    <div
      className={cn('overflow-hidden rounded-xl border border-line shadow-soft', className)}
      style={{ background: surface, color: ink }}
      aria-hidden
    >
      {chrome && (
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: panel, borderBottom: `1px solid ${line}` }}>
          <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
          <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
          <span className="h-2 w-2 rounded-full bg-[#28C840]" />
          <span
            className="ml-2 h-4 flex-1 truncate rounded px-2 text-[7px] leading-4"
            style={{ background: surface, color: muted }}
          >
            {config.brand.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com
          </span>
        </div>
      )}

      {/* site nav */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${line}` }}>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded" style={{ background: accent }} />
          <span className="text-[9px] font-bold tracking-tight">{config.brand}</span>
        </div>
        <div className="hidden gap-2.5 sm:flex">
          {nav.map((n) => (
            <span key={n} className="text-[7px]" style={{ color: muted }}>
              {n}
            </span>
          ))}
        </div>
        <span className="rounded px-1.5 py-0.5 text-[7px] font-semibold text-white" style={{ background: accent }}>
          {config.cta ?? 'Get started'}
        </span>
      </div>

      <div className="p-4">{renderBody(config, { accent, accent2, ink, muted, panel, line, surface })}</div>
    </div>
  );
}

type Palette = { accent: string; accent2: string; ink: string; muted: string; panel: string; line: string; surface: string };

function Hero({ config, p, center }: { config: TemplatePreviewConfig; p: Palette; center?: boolean }) {
  return (
    <div className={cn(center && 'text-center')}>
      <span
        className="inline-block rounded-full px-1.5 py-0.5 text-[6px] font-semibold"
        style={{ background: `${p.accent}22`, color: p.accent }}
      >
        New · Trusted by teams in 5 regions
      </span>
      <p className="mt-1.5 text-[13px] font-extrabold leading-[1.1] tracking-tight">{config.headline}</p>
      {config.sub && (
        <p className="mt-1 text-[7px] leading-snug" style={{ color: p.muted }}>
          {config.sub}
        </p>
      )}
      <div className={cn('mt-2 flex gap-1', center && 'justify-center')}>
        <span className="rounded px-2 py-1 text-[7px] font-semibold text-white" style={{ background: p.accent }}>
          {config.cta ?? 'Get started'}
        </span>
        <span className="rounded px-2 py-1 text-[7px] font-semibold" style={{ border: `1px solid ${p.line}` }}>
          Learn more
        </span>
      </div>
    </div>
  );
}

function Visual({ p, h = 'h-24' }: { p: Palette; h?: string }) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-lg', h)}
      style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})` }}
    >
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20" />
      <div className="absolute bottom-2 left-2 right-8 rounded bg-white/90 p-1.5">
        <div className="h-1 w-8 rounded" style={{ background: p.accent }} />
        <div className="mt-1 h-1 w-14 rounded bg-black/10" />
        <div className="mt-0.5 h-1 w-10 rounded bg-black/10" />
      </div>
    </div>
  );
}

function Cards({ p, n = 3 }: { p: Palette; n?: number }) {
  return (
    <div className={cn('mt-3 grid gap-1.5', n === 4 ? 'grid-cols-4' : 'grid-cols-3')}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="rounded-md p-1.5" style={{ background: p.panel }}>
          <div className="h-2.5 w-2.5 rounded" style={{ background: i % 2 ? p.accent2 : p.accent, opacity: 0.85 }} />
          <div className="mt-1 h-1 w-3/4 rounded" style={{ background: p.ink, opacity: 0.7 }} />
          <div className="mt-0.5 h-1 w-full rounded" style={{ background: p.ink, opacity: 0.15 }} />
          <div className="mt-0.5 h-1 w-2/3 rounded" style={{ background: p.ink, opacity: 0.15 }} />
        </div>
      ))}
    </div>
  );
}

function renderBody(config: TemplatePreviewConfig, p: Palette) {
  switch (config.layout) {
    case 'centered':
      return (
        <>
          <Hero config={config} p={p} center />
          <div className="mt-3 flex justify-center gap-4">
            {['4.9★', '12k+', '24/7'].map((s) => (
              <div key={s} className="text-center">
                <div className="text-[10px] font-extrabold" style={{ color: p.accent }}>{s}</div>
                <div className="h-1 w-8 rounded" style={{ background: p.ink, opacity: 0.15 }} />
              </div>
            ))}
          </div>
          <Cards p={p} />
        </>
      );

    case 'dashboard':
      return (
        <div className="grid grid-cols-[3rem_1fr] gap-2">
          <div className="space-y-1 rounded-md p-1.5" style={{ background: p.panel }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1.5 rounded" style={{ background: i === 1 ? p.accent : p.ink, opacity: i === 1 ? 1 : 0.2 }} />
            ))}
          </div>
          <div>
            <p className="text-[10px] font-extrabold">{config.headline}</p>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {['$84.2k', '1,284', '96.4%'].map((v, i) => (
                <div key={v} className="rounded-md p-1.5" style={{ background: p.panel }}>
                  <div className="text-[5px]" style={{ color: p.muted }}>{['Revenue', 'Orders', 'Uptime'][i]}</div>
                  <div className="text-[9px] font-extrabold">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex h-14 items-end gap-0.5 rounded-md p-1.5" style={{ background: p.panel }}>
              {[40, 55, 35, 70, 60, 85, 72, 90, 66, 95, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i > 8 ? p.accent : `${p.accent}66` }} />
              ))}
            </div>
          </div>
        </div>
      );

    case 'listing':
      return (
        <>
          <Hero config={config} p={p} />
          <div className="mt-2 flex gap-1 rounded-md p-1" style={{ background: p.panel }}>
            {['Location', 'Price', 'Beds'].map((f) => (
              <span key={f} className="flex-1 rounded px-1 py-0.5 text-[6px]" style={{ background: p.surface, color: p.muted }}>{f}</span>
            ))}
            <span className="rounded px-1.5 py-0.5 text-[6px] font-semibold text-white" style={{ background: p.accent }}>Search</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {['$640k', '$1.2m', '$485k'].map((price, i) => (
              <div key={price} className="overflow-hidden rounded-md" style={{ background: p.panel }}>
                <div className="h-8" style={{ background: `linear-gradient(135deg, ${i % 2 ? p.accent2 : p.accent}, ${p.accent}55)` }} />
                <div className="p-1">
                  <div className="text-[7px] font-bold">{price}</div>
                  <div className="h-1 w-3/4 rounded" style={{ background: p.ink, opacity: 0.15 }} />
                </div>
              </div>
            ))}
          </div>
        </>
      );

    case 'store':
      return (
        <>
          <div className="grid grid-cols-[1.2fr_1fr] items-center gap-3">
            <Hero config={config} p={p} />
            <Visual p={p} h="h-20" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {['$49', '$89', '$129', '$34'].map((price, i) => (
              <div key={price} className="rounded-md p-1" style={{ background: p.panel }}>
                <div className="h-8 rounded" style={{ background: `${i % 2 ? p.accent2 : p.accent}33` }} />
                <div className="mt-1 h-1 w-3/4 rounded" style={{ background: p.ink, opacity: 0.4 }} />
                <div className="mt-0.5 text-[7px] font-bold" style={{ color: p.accent }}>{price}</div>
              </div>
            ))}
          </div>
        </>
      );

    case 'booking':
      return (
        <div className="grid grid-cols-[1.2fr_1fr] gap-3">
          <div>
            <Hero config={config} p={p} />
            <Cards p={p} n={3} />
          </div>
          <div className="rounded-lg p-2" style={{ background: p.panel }}>
            <div className="text-[7px] font-bold">Book a visit</div>
            <div className="mt-1 grid grid-cols-5 gap-0.5">
              {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
                <div key={i} className="rounded py-0.5 text-center text-[6px]" style={{ background: i === 2 ? p.accent : p.surface, color: i === 2 ? '#fff' : p.muted }}>{d}</div>
              ))}
            </div>
            <div className="mt-1 space-y-0.5">
              {['9:00', '10:30', '14:00'].map((t, i) => (
                <div key={t} className="rounded px-1 py-0.5 text-[6px]" style={{ border: `1px solid ${i === 1 ? p.accent : p.line}`, color: i === 1 ? p.accent : p.muted }}>{t}</div>
              ))}
            </div>
            <div className="mt-1 rounded py-0.5 text-center text-[6px] font-semibold text-white" style={{ background: p.accent }}>Confirm</div>
          </div>
        </div>
      );

    case 'editorial':
      return (
        <>
          <p className="text-[13px] font-extrabold leading-tight tracking-tight">{config.headline}</p>
          <div className="mt-2 grid grid-cols-[1.4fr_1fr] gap-2">
            <Visual p={p} h="h-20" />
            <div className="space-y-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-1">
                  <div className="h-6 w-6 shrink-0 rounded" style={{ background: `${p.accent}${i ? '55' : 'aa'}` }} />
                  <div className="flex-1 space-y-0.5">
                    <div className="h-1 w-full rounded" style={{ background: p.ink, opacity: 0.6 }} />
                    <div className="h-1 w-2/3 rounded" style={{ background: p.ink, opacity: 0.15 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Cards p={p} n={4} />
        </>
      );

    case 'split':
    default:
      return (
        <>
          <div className="grid grid-cols-[1.2fr_1fr] items-center gap-3">
            <Hero config={config} p={p} />
            <Visual p={p} />
          </div>
          <Cards p={p} />
        </>
      );
  }
}
