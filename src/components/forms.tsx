'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Send, ShieldCheck } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { REGIONS } from '@/data/regions';
import { SITE } from '@/data/site';
import { useRegion } from './providers';
import { submitForm, HONEYPOT_FIELD, CONSENT_WORDING, PRIVACY_WORDING, type FormName } from '@/lib/forms';
import { cn } from '@/lib/utils';
import { Button, NoteBox } from './ui';

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

export function Field({
  id,
  label,
  type = 'text',
  required,
  placeholder,
  hint,
  value,
  onChange,
  className,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  autoComplete?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-line bg-bg px-4 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
      />
      {hint && <p className="mt-1.5 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}

export function TextArea({
  id,
  label,
  required,
  placeholder,
  value,
  onChange,
  rows = 5,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
      />
    </div>
  );
}

export function Select({
  id,
  label,
  required,
  value,
  onChange,
  options,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-line bg-bg px-4 text-sm outline-none transition-colors focus:border-accent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Hidden field that only bots fill in. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
      <label htmlFor={HONEYPOT_FIELD}>Do not fill this in</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function ConsentCheckbox({
  id,
  checked,
  onChange,
  wording = CONSENT_WORDING,
  required = true,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  wording?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer gap-3 rounded-xl border border-line bg-bg-soft p-4">
      <input
        id={id}
        name={id}
        type="checkbox"
        required={required}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--accent))]"
      />
      <span className="text-xs leading-relaxed text-fg-muted">{wording}</span>
    </label>
  );
}

export function SpamNotice() {
  return (
    <p className="flex items-start gap-2 text-xs text-fg-subtle">
      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
      Protected by rate limiting and a bot challenge. Add your Cloudflare Turnstile or reCAPTCHA key in the
      environment file to enable the visible challenge.
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Success state                                                      */
/* ------------------------------------------------------------------ */

function SuccessPanel({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="rounded-2xl border border-success/35 bg-success/10 p-8 text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 16 }}
        className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success text-bg"
      >
        <Check className="h-7 w-7" aria-hidden />
      </motion.span>
      <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-fg-muted">{body}</p>
      <p className="mt-5 text-xs text-fg-subtle">
        Need it faster? Call{' '}
        <a href={SITE.phoneHref} className="text-accent underline underline-offset-4">
          {SITE.phone}
        </a>
        .
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Generic form wrapper                                               */
/* ------------------------------------------------------------------ */

export function FormShell({
  formName,
  fields,
  children,
  submitLabel = 'Send',
  successTitle,
  successBody,
  disabled,
  className,
  footer,
}: {
  formName: FormName;
  fields: Record<string, unknown>;
  children: ReactNode;
  submitLabel?: string;
  successTitle: string;
  successBody: string;
  disabled?: boolean;
  className?: string;
  footer?: ReactNode;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  return (
    <AnimatePresence mode="wait">
      {state === 'done' ? (
        <SuccessPanel key="success" title={successTitle} body={successBody} />
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -8 }}
          className={cn('relative space-y-5', className)}
          noValidate={false}
          onSubmit={async (e) => {
            e.preventDefault();
            setState('sending');
            const res = await submitForm({ form: formName, fields });
            if (res.ok) {
              setState('done');
            } else {
              setState('error');
              setMessage(res.message);
            }
          }}
        >
          {children}

          {state === 'error' && (
            <NoteBox tone="warn">
              {message} You can also email{' '}
              <a href={`mailto:${SITE.email}`} className="text-accent underline underline-offset-4">
                {SITE.email}
              </a>{' '}
              or call {SITE.phone}.
            </NoteBox>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={state === 'sending' || disabled} icon={state === 'sending' ? Loader2 : Send} iconRight>
              {state === 'sending' ? 'Sending' : submitLabel}
            </Button>
            {footer}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact form                                                       */
/* ------------------------------------------------------------------ */

const BUDGETS = [
  { value: '', label: 'Select a range' },
  { value: 'under-5k', label: 'Under 5,000' },
  { value: '5k-15k', label: '5,000 to 15,000' },
  { value: '15k-50k', label: '15,000 to 50,000' },
  { value: '50k-150k', label: '50,000 to 150,000' },
  { value: 'over-150k', label: 'Over 150,000' },
  { value: 'recurring', label: 'Monthly retainer' },
  { value: 'unsure', label: 'Not sure yet' },
];

const CONTACT_TIMES = [
  { value: 'any', label: 'Any time' },
  { value: 'morning', label: 'Morning, my time zone' },
  { value: 'afternoon', label: 'Afternoon, my time zone' },
  { value: 'evening', label: 'Evening, my time zone' },
];

export function ContactForm({ defaultService = '' }: { defaultService?: string }) {
  const { code } = useRegion();
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: defaultService,
    region: code,
    budget: '',
    message: '',
    preferredTime: 'any',
  });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');

  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <FormShell
      formName="contact"
      fields={{ ...values, consent, [HONEYPOT_FIELD]: honey }}
      submitLabel="Send enquiry"
      disabled={!consent}
      successTitle="Enquiry received"
      successBody="A named person will reply within four business hours. You will also get a confirmation email with a copy of what you sent."
      footer={<p className="text-xs text-fg-subtle">Typical first reply: under 4 business hours.</p>}
    >
      <Honeypot value={honey} onChange={setHoney} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" required value={values.name} onChange={set('name')} autoComplete="name" />
        <Field id="email" label="Email" type="email" required value={values.email} onChange={set('email')} autoComplete="email" />
        <Field id="phone" label="Phone" type="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" />
        <Field id="company" label="Company" value={values.company} onChange={set('company')} autoComplete="organization" />

        <Select
          id="service"
          label="Which service?"
          required
          value={values.service}
          onChange={set('service')}
          options={[
            { value: '', label: 'Select a service' },
            ...SERVICES.map((s) => ({ value: s.slug, label: s.name })),
            { value: 'several', label: 'Several of these' },
            { value: 'unsure', label: 'Not sure yet' },
          ]}
        />

        <Select
          id="region"
          label="Your region"
          required
          value={values.region}
          onChange={set('region')}
          options={REGIONS.map((r) => ({ value: r.code, label: `${r.label} (${r.currency})` }))}
        />

        <Select id="budget" label="Budget range" value={values.budget} onChange={set('budget')} options={BUDGETS} />
        <Select
          id="preferredTime"
          label="Preferred contact time"
          value={values.preferredTime}
          onChange={set('preferredTime')}
          options={CONTACT_TIMES}
        />
      </div>

      <TextArea
        id="message"
        label="What do you need?"
        required
        rows={6}
        placeholder="Tell us the situation rather than the solution. What is not working, and what would good look like?"
        value={values.message}
        onChange={set('message')}
      />

      <ConsentCheckbox id="consent" checked={consent} onChange={setConsent} />
      <p className="text-xs leading-relaxed text-fg-subtle">{PRIVACY_WORDING}</p>
      <SpamNotice />
    </FormShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Short enquiry form, reused by marketplace and products             */
/* ------------------------------------------------------------------ */

export function EnquiryForm({
  formName = 'marketplace-enquiry',
  subject,
  submitLabel = 'Send enquiry',
  successTitle = 'Enquiry received',
  successBody = 'We will confirm availability and pricing for your region within one business day.',
}: {
  formName?: FormName;
  subject: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
}) {
  const { code } = useRegion();
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '', region: code, subject });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <FormShell
      formName={formName}
      fields={{ ...values, consent, [HONEYPOT_FIELD]: honey }}
      submitLabel={submitLabel}
      disabled={!consent}
      successTitle={successTitle}
      successBody={successBody}
    >
      <Honeypot value={honey} onChange={setHoney} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="eq-name" label="Name" required value={values.name} onChange={set('name')} autoComplete="name" />
        <Field id="eq-email" label="Email" type="email" required value={values.email} onChange={set('email')} autoComplete="email" />
        <Field id="eq-phone" label="Phone" type="tel" value={values.phone} onChange={set('phone')} className="sm:col-span-2" autoComplete="tel" />
      </div>
      <TextArea
        id="eq-message"
        label="What do you need?"
        rows={4}
        placeholder="Anything specific about your setup, timing or region."
        value={values.message}
        onChange={set('message')}
      />
      <ConsentCheckbox id="eq-consent" checked={consent} onChange={setConsent} />
    </FormShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Gated download                                                     */
/* ------------------------------------------------------------------ */

export function GatedDownloadForm({ title, resource }: { title: string; resource: string }) {
  const [values, setValues] = useState({ name: '', email: '', company: '', resource });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <div className="rounded-2xl border border-accent/25 bg-accent/5 p-6 sm:p-8">
      <p className="eyebrow mb-3">Gated resource</p>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        Three fields and the download link arrives by email. We do not add you to a drip sequence.
      </p>

      <div className="mt-6">
        <FormShell
          formName="gated-download"
          fields={{ ...values, consent, [HONEYPOT_FIELD]: honey }}
          submitLabel="Email me the download"
          disabled={!consent}
          successTitle="On its way"
          successBody="Check your inbox for the download link. It does not expire."
        >
          <Honeypot value={honey} onChange={setHoney} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="gd-name" label="Name" required value={values.name} onChange={set('name')} />
            <Field id="gd-email" label="Work email" type="email" required value={values.email} onChange={set('email')} />
            <Field id="gd-company" label="Company" value={values.company} onChange={set('company')} />
          </div>
          <ConsentCheckbox
            id="gd-consent"
            checked={consent}
            onChange={setConsent}
            wording="Send me this download and occasional related updates. I can unsubscribe at any time."
          />
        </FormShell>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Job application                                                    */
/* ------------------------------------------------------------------ */

export function JobApplicationForm({ roles }: { roles: { slug: string; title: string }[] }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    role: roles[0]?.slug ?? '',
    linkedin: '',
    portfolio: '',
    message: '',
  });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <FormShell
      formName="job-application"
      fields={{ ...values, consent, [HONEYPOT_FIELD]: honey }}
      submitLabel="Send application"
      disabled={!consent}
      successTitle="Application received"
      successBody="We read every application ourselves and reply either way, usually within five working days."
    >
      <Honeypot value={honey} onChange={setHoney} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="ja-name" label="Name" required value={values.name} onChange={set('name')} autoComplete="name" />
        <Field id="ja-email" label="Email" type="email" required value={values.email} onChange={set('email')} autoComplete="email" />
        <Field id="ja-phone" label="Phone" type="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" />
        <Select
          id="ja-role"
          label="Role"
          required
          value={values.role}
          onChange={set('role')}
          options={roles.map((r) => ({ value: r.slug, label: r.title }))}
        />
        <Field id="ja-linkedin" label="LinkedIn" value={values.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/..." />
        <Field id="ja-portfolio" label="Portfolio or GitHub" value={values.portfolio} onChange={set('portfolio')} />
      </div>
      <TextArea
        id="ja-message"
        label="Why this role?"
        required
        rows={5}
        placeholder="A few sentences beats a cover letter. What have you done that is closest to this job?"
        value={values.message}
        onChange={set('message')}
      />
      <NoteBox className="text-xs">
        Attach your CV by replying to the confirmation email. We do not accept file uploads through this form,
        which keeps your documents out of a public endpoint.
      </NoteBox>
      <ConsentCheckbox
        id="ja-consent"
        checked={consent}
        onChange={setConsent}
        wording="I agree to Texas Solutions storing these details to consider my application. I can ask for them to be deleted at any time."
      />
    </FormShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Investor enquiry                                                   */
/* ------------------------------------------------------------------ */

export function InvestorForm() {
  const [values, setValues] = useState({ name: '', email: '', firm: '', type: 'institutional', message: '' });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <FormShell
      formName="investor-enquiry"
      fields={{ ...values, consent, [HONEYPOT_FIELD]: honey }}
      submitLabel="Send enquiry"
      disabled={!consent}
      successTitle="Enquiry received"
      successBody="Investment enquiries go directly to the managing director and are answered within two business days."
    >
      <Honeypot value={honey} onChange={setHoney} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="iv-name" label="Name" required value={values.name} onChange={set('name')} />
        <Field id="iv-email" label="Email" type="email" required value={values.email} onChange={set('email')} />
        <Field id="iv-firm" label="Firm" value={values.firm} onChange={set('firm')} className="sm:col-span-2" />
        <Select
          id="iv-type"
          label="Enquiry type"
          value={values.type}
          onChange={set('type')}
          className="sm:col-span-2"
          options={[
            { value: 'institutional', label: 'Institutional investor' },
            { value: 'angel', label: 'Angel or individual' },
            { value: 'strategic', label: 'Strategic or acquirer' },
            { value: 'partner', label: 'Partnership' },
            { value: 'other', label: 'Something else' },
          ]}
        />
      </div>
      <TextArea id="iv-message" label="What would you like to discuss?" required rows={5} value={values.message} onChange={set('message')} />
      <ConsentCheckbox
        id="iv-consent"
        checked={consent}
        onChange={setConsent}
        wording="I agree to be contacted about this enquiry. Nothing on this site is an offer of securities."
      />
    </FormShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Media kit request                                                  */
/* ------------------------------------------------------------------ */

export function MediaKitForm() {
  const [values, setValues] = useState({ name: '', email: '', company: '', placement: 'banner', budget: '' });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <FormShell
      formName="media-kit"
      fields={{ ...values, consent, [HONEYPOT_FIELD]: honey }}
      submitLabel="Request the media kit"
      disabled={!consent}
      successTitle="Media kit on its way"
      successBody="The PDF and the current rate card arrive by email, usually within the hour during business days."
    >
      <Honeypot value={honey} onChange={setHoney} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="mk-name" label="Name" required value={values.name} onChange={set('name')} />
        <Field id="mk-email" label="Work email" type="email" required value={values.email} onChange={set('email')} />
        <Field id="mk-company" label="Company" required value={values.company} onChange={set('company')} />
        <Select
          id="mk-placement"
          label="Placement of interest"
          value={values.placement}
          onChange={set('placement')}
          options={[
            { value: 'banner', label: 'Leaderboard banner' },
            { value: 'in-article', label: 'In-article unit' },
            { value: 'sponsored', label: 'Sponsored post' },
            { value: 'newsletter', label: 'Newsletter feature' },
            { value: 'guide', label: 'Guide sponsorship' },
            { value: 'unsure', label: 'Not sure yet' },
          ]}
        />
        <Field id="mk-budget" label="Monthly budget" value={values.budget} onChange={set('budget')} className="sm:col-span-2" placeholder="Optional, helps us suggest a placement" />
      </div>
      <ConsentCheckbox
        id="mk-consent"
        checked={consent}
        onChange={setConsent}
        wording="Send me the media kit and rate card. I can unsubscribe at any time."
      />
    </FormShell>
  );
}
