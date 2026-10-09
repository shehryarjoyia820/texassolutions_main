'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Send, ShieldCheck } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { SITE } from '@/data/site';
import {
  submitForm,
  readCaptchaToken,
  HONEYPOT_FIELD,
  HCAPTCHA_FIELD,
  ENQUIRY_CONSENT_WORDING,
  MARKETING_CONSENT_WORDING,
  PRIVACY_WORDING,
  type FormName,
} from '@/lib/forms';
import { cn } from '@/lib/utils';
import { Button, NoteBox } from './ui';
import { useHCaptcha } from './forms/hcaptcha';
import { contextFields, describeContext, parseContactContext, type ContactContext } from './forms/contact-context';

/* ------------------------------------------------------------------ */
/*  Field errors, shared between FormShell and the field primitives    */
/* ------------------------------------------------------------------ */

type FieldErrors = Record<string, string>;

const FieldErrorContext = createContext<{ errors: FieldErrors; clear: (id: string) => void }>({
  errors: {},
  clear: () => {},
});

function useFieldError(id: string) {
  const ctx = useContext(FieldErrorContext);
  return { error: ctx.errors[id], clear: () => ctx.clear(id) };
}

const controlBase =
  'w-full rounded-xl border bg-bg text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40';

function controlClass(error?: string) {
  return cn(controlBase, error ? 'border-danger' : 'border-line');
}

function describedBy(...ids: (string | undefined | false)[]) {
  const out = ids.filter(Boolean).join(' ');
  return out || undefined;
}

function FieldLabel({
  htmlFor,
  label,
  required,
  showOptional = true,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  showOptional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
      {label}
      {required ? (
        <>
          <span className="ml-1 text-accent" aria-hidden>
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : (
        showOptional && <span className="ml-1 font-normal text-fg-subtle">(optional)</span>
      )}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-danger">
      {error}
    </p>
  );
}

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
  errorMessage,
  showOptional,
  inputMode,
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
  /** Message shown when a required value is missing. */
  errorMessage?: string;
  /** Append "(optional)" to the label of non-required fields. Default true. */
  showOptional?: boolean;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'url';
}) {
  const { error, clear } = useFieldError(id);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} showOptional={showOptional} />
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, error && errorId)}
        data-label={label}
        data-error={errorMessage}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => {
          onChange(e.target.value);
          if (error) clear();
        }}
        className={cn(controlClass(error), 'h-12 px-4')}
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-fg-subtle">
          {hint}
        </p>
      )}
      <FieldError id={errorId} error={error} />
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
  errorMessage,
  showOptional,
}: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  className?: string;
  errorMessage?: string;
  showOptional?: boolean;
}) {
  const { error, clear } = useFieldError(id);
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} showOptional={showOptional} />
      <textarea
        id={id}
        name={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(error && errorId)}
        data-label={label}
        data-error={errorMessage}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (error) clear();
        }}
        className={cn(controlClass(error), 'resize-y px-4 py-3')}
      />
      <FieldError id={errorId} error={error} />
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
  errorMessage,
  showOptional,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  errorMessage?: string;
  showOptional?: boolean;
  hint?: string;
}) {
  const { error, clear } = useFieldError(id);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} showOptional={showOptional} />
      <select
        id={id}
        name={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, error && errorId)}
        data-label={label}
        data-error={errorMessage}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (error) clear();
        }}
        className={cn(controlClass(error), 'h-12 px-4')}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-fg-subtle">
          {hint}
        </p>
      )}
      <FieldError id={errorId} error={error} />
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
  wording = ENQUIRY_CONSENT_WORDING,
  required = true,
  errorMessage = 'Please tick this box so we can reply to your enquiry.',
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  wording?: string;
  required?: boolean;
  errorMessage?: string;
}) {
  const { error, clear } = useFieldError(id);
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          'flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl border bg-bg-soft p-4 focus-within:border-accent',
          error ? 'border-danger' : 'border-line',
        )}
      >
        <input
          id={id}
          name={id}
          type="checkbox"
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error && errorId)}
          data-error={errorMessage}
          checked={checked}
          onChange={(e) => {
            onChange(e.target.checked);
            if (error) clear();
          }}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[rgb(var(--accent))]"
        />
        <span className="text-sm leading-relaxed text-fg-muted">
          {wording}
          {required && (
            <>
              <span className="ml-1 text-accent" aria-hidden>
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </span>
      </label>
      <FieldError id={errorId} error={error} />
    </div>
  );
}

/** Visitor-facing spam protection line. Only claims hCaptcha when the form shows it. */
export function SpamNotice({ captcha = false }: { captcha?: boolean }) {
  return (
    <p className="flex items-start gap-2 text-xs text-fg-subtle">
      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
      {captcha ? (
        <span>
          Spam protection by hCaptcha. Its{' '}
          <a href="https://www.hcaptcha.com/privacy" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
            privacy policy
          </a>{' '}
          and{' '}
          <a href="https://www.hcaptcha.com/terms" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
            terms
          </a>{' '}
          apply.
        </span>
      ) : (
        <span>Protected against automated spam.</span>
      )}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Success state                                                      */
/* ------------------------------------------------------------------ */

function SuccessPanel({ title, body }: { title: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="status"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="rounded-2xl border border-success/35 bg-success/10 p-8 text-center outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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

function ContactFallback() {
  return (
    <>
      email{' '}
      <a href={`mailto:${SITE.email}`} className="text-accent underline underline-offset-4">
        {SITE.email}
      </a>{' '}
      or call{' '}
      <a href={SITE.phoneHref} className="text-accent underline underline-offset-4">
        {SITE.phone}
      </a>
      .
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;

/** Validates every visible control in DOM order and returns messages keyed by id. */
function validateControls(form: HTMLFormElement): { errors: FieldErrors; first: Control | null } {
  const errors: FieldErrors = {};
  let first: Control | null = null;
  for (const node of Array.from(form.elements)) {
    if (!(node instanceof HTMLInputElement || node instanceof HTMLSelectElement || node instanceof HTMLTextAreaElement)) continue;
    const el = node as Control;
    if (!el.id || el.disabled || el.type === 'hidden' || el.name === HONEYPOT_FIELD || el.name === HCAPTCHA_FIELD) continue;

    const label = el.dataset.label || 'This field';
    const value = el.value.trim();
    let msg = '';
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      if (el.required && !el.checked) msg = el.dataset.error || 'Please tick this box to continue.';
    } else if (el.required && !value) {
      msg = el.dataset.error || `${label.replace(/\?$/, '')} is required.`;
    } else if (value && el.type === 'email' && (!el.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
      msg = 'Enter a valid email address, like name@company.com.';
    } else if (value && el.type === 'tel' && !PHONE_RE.test(value)) {
      msg = 'Enter a valid phone number: digits, spaces and an optional leading +.';
    } else if (!el.validity.valid) {
      msg = el.validationMessage;
    }
    if (msg) {
      errors[el.id] = msg;
      if (!first) first = el;
    }
  }
  return { errors, first };
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
  captcha = false,
  beforeSubmit,
  onSuccess,
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
  /** Render the Web3Forms hCaptcha widget and send its token. */
  captcha?: boolean;
  /** Return a message to stop the submission (e.g. a duplicate request). */
  beforeSubmit?: () => string | null;
  onSuccess?: () => void;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [captchaError, setCaptchaError] = useState('');
  const sendingRef = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const hc = useHCaptcha(captcha);
  const captchaId = `${formName}-captcha`;

  const errorCount = Object.keys(errors).length + (captchaError ? 1 : 0);
  const sending = state === 'sending';

  const clear = (id: string) =>
    setErrors((e) => {
      if (!(id in e)) return e;
      const next = { ...e };
      delete next[id];
      return next;
    });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sendingRef.current || state === 'done' || disabled) return;
    const form = e.currentTarget;

    const { errors: found, first } = validateControls(form);
    let token = '';
    let capErr = '';
    if (captcha) {
      token = readCaptchaToken(form);
      if (!token && hc.status === 'ready') capErr = 'Please complete the "I am human" check before sending.';
      if (!token && hc.status === 'loading') capErr = 'The spam check is still loading. Please wait a moment and try again.';
    }
    setErrors(found);
    setCaptchaError(capErr);
    if (first) {
      first.focus();
      return;
    }
    if (capErr) {
      hc.containerRef.current?.focus();
      return;
    }

    const blocked = beforeSubmit?.();
    if (blocked) {
      setState('error');
      setMessage(blocked);
      return;
    }

    sendingRef.current = true;
    setState('sending');
    setMessage('');
    const res = await submitForm({ form: formName, fields, captchaToken: token || undefined });
    sendingRef.current = false;
    if (res.ok) {
      setState('done');
      onSuccess?.();
    } else {
      setState('error');
      setMessage(res.message);
      if (captcha) hc.reset(); // tokens are single use
      statusRef.current?.focus();
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === 'done' ? (
        <SuccessPanel key="success" title={successTitle} body={successBody} />
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -8 }}
          className={cn('relative space-y-5', className)}
          noValidate
          aria-busy={sending || undefined}
          onSubmit={handleSubmit}
        >
          <FieldErrorContext.Provider value={{ errors, clear }}>{children}</FieldErrorContext.Provider>

          {captcha && (
            <div className="space-y-2">
              <div
                ref={hc.containerRef}
                id={captchaId}
                tabIndex={-1}
                aria-describedby={captchaError ? `${captchaId}-error` : undefined}
                className="h-captcha min-h-[78px] outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                data-captcha="true"
              />
              {hc.status === 'loading' && <p className="text-xs text-fg-subtle">Loading the spam check…</p>}
              {hc.status === 'failed' && (
                <p role="alert" className="rounded-lg border border-warn/30 bg-warn/5 p-3 text-xs leading-relaxed text-fg-muted">
                  The spam check could not load (a privacy extension or network filter may be blocking it). You can
                  still try sending, or contact us directly: <ContactFallback />
                </p>
              )}
              {captchaError && (
                <p id={`${captchaId}-error`} className="text-xs font-medium text-danger">
                  {captchaError}
                </p>
              )}
              <SpamNotice captcha />
            </div>
          )}

          {/* Announced to screen readers whenever validation or sending fails. */}
          <div ref={statusRef} tabIndex={-1} role="alert" aria-live="assertive" className="outline-none">
            {errorCount > 0 && (
              <p className="rounded-lg border border-danger/40 bg-danger/5 p-3 text-sm text-fg">
                {errorCount === 1 ? 'Please fix the highlighted field.' : `Please fix the ${errorCount} highlighted fields.`}
              </p>
            )}
            {state === 'error' && message && (
              <NoteBox tone="warn">
                {message} You can also <ContactFallback />
              </NoteBox>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={sending || disabled}
              aria-disabled={sending || disabled || undefined}
              icon={sending ? Loader2 : Send}
              iconRight
              className={sending ? '[&>svg]:animate-spin' : undefined}
            >
              {sending ? 'Sending…' : submitLabel}
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

const DISPATCH_BUDGET = 'Truck dispatch (percentage of weekly gross)';
const NOT_SURE = 'Not sure yet';

/** Values are the visible labels so the email reads plainly. */
const GENERAL_BUDGETS = [
  'Under US$1,000 (one-time project)',
  'US$1,000–5,000 (one-time)',
  'US$5,000–15,000 (one-time)',
  'US$15,000+ (one-time)',
  'Monthly: under US$1,000/month',
  'Monthly: US$1,000–4,000/month',
  'Monthly: US$4,000+/month',
  DISPATCH_BUDGET,
  NOT_SURE,
];

const ENGINE_BUDGETS = [
  'Under US$3,000 per engine',
  'US$3,000–6,000 per engine',
  'US$6,000–12,000 per engine',
  'US$12,000+ per engine',
  NOT_SURE,
];

const CONTACT_TIMES = [
  { value: '', label: 'No preference' },
  { value: 'Morning (my time zone)', label: 'Morning, my time zone' },
  { value: 'Afternoon (my time zone)', label: 'Afternoon, my time zone' },
  { value: 'Evening (my time zone)', label: 'Evening, my time zone' },
];

const SERVICE_OPTIONS = [
  { value: '', label: 'Select a service' },
  ...SERVICES.map((s) => ({ value: s.slug, label: s.name })),
  { value: 'several', label: 'Several of these' },
  { value: 'unsure', label: 'Not sure yet' },
];
const SERVICE_VALUES = new Set(SERVICE_OPTIONS.map((o) => o.value).filter(Boolean));

function budgetOptionsFor(service: string): string[] | null {
  if (service === 'truck-dispatch') return null;
  if (service === 'auto-engines') return ENGINE_BUDGETS;
  return GENERAL_BUDGETS;
}

export function ContactForm({ defaultService = '' }: { defaultService?: string }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    service: SERVICE_VALUES.has(defaultService) ? defaultService : '',
    budget: '',
    message: '',
    preferredTime: '',
  });
  const [enquiryConsent, setEnquiryConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const [context, setContext] = useState<ContactContext>({});

  // Context from links such as /contact?service=truck-dispatch&package=growth
  useEffect(() => {
    const ctx = parseContactContext(window.location.search);
    setContext(ctx);
    if (ctx.service && SERVICE_VALUES.has(ctx.service)) {
      const svc = ctx.service;
      setValues((s) => ({ ...s, service: svc }));
    }
  }, []);

  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));
  const setService = (v: string) =>
    setValues((s) => {
      const opts = budgetOptionsFor(v);
      return { ...s, service: v, budget: opts && opts.includes(s.budget) ? s.budget : '' };
    });

  const budgetOptions = budgetOptionsFor(values.service);
  const summary = describeContext(context, (slug) => SERVICES.find((s) => s.slug === slug)?.name);
  const hiddenContext = contextFields(context);

  return (
    <FormShell
      formName="contact"
      captcha
      fields={{
        name: values.name,
        email: values.email,
        phone: values.phone,
        service: values.service,
        budget: budgetOptions ? values.budget : DISPATCH_BUDGET,
        message: values.message,
        preferred_contact_time: values.preferredTime,
        enquiry_consent: enquiryConsent ? 'yes' : 'no',
        marketing_consent: marketingConsent ? 'yes' : 'no',
        ...hiddenContext,
        [HONEYPOT_FIELD]: honey,
      }}
      submitLabel="Send enquiry"
      successTitle="Enquiry received"
      successBody="A named person will reply within four business hours, by email or phone as you prefer."
      footer={<p className="text-xs text-fg-subtle">Typical first reply: under 4 business hours.</p>}
    >
      <Honeypot value={honey} onChange={setHoney} />

      {summary.length > 0 && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm" aria-labelledby="ctx-summary-title">
          <p id="ctx-summary-title" className="font-medium">
            You are asking about:
          </p>
          <ul className="mt-1.5 space-y-0.5 text-fg-muted">
            {summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {Object.entries(hiddenContext).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
        </div>
      )}

      <p className="text-xs text-fg-subtle">
        Fields marked <span className="text-accent" aria-hidden>*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          required
          errorMessage="Please enter your name."
          value={values.name}
          onChange={set('name')}
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          errorMessage="Please enter your email address."
          value={values.email}
          onChange={set('email')}
          autoComplete="email"
          inputMode="email"
        />
        <Field id="phone" label="Phone" type="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" />

        <Select
          id="service"
          label="Which service?"
          required
          errorMessage="Please choose a service, or pick “Not sure yet”."
          value={values.service}
          onChange={setService}
          options={SERVICE_OPTIONS}
        />

        {budgetOptions ? (
          <Select
            id="budget"
            label={values.service === 'auto-engines' ? 'Budget per engine' : 'Budget'}
            value={values.budget}
            onChange={set('budget')}
            options={[{ value: '', label: 'Select a range' }, ...budgetOptions.map((b) => ({ value: b, label: b }))]}
          />
        ) : (
          <div>
            <p className="mb-1.5 block text-sm font-medium">Budget</p>
            <p className="flex min-h-12 items-center rounded-xl border border-line bg-bg-soft px-4 py-3 text-sm text-fg-muted">
              Dispatch fee is a percentage of weekly gross — no budget needed.
            </p>
          </div>
        )}

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
        errorMessage="Please tell us briefly what you need."
        rows={6}
        placeholder="Tell us the situation rather than the solution. What is not working, and what would good look like?"
        value={values.message}
        onChange={set('message')}
      />

      <ConsentCheckbox id="enquiry_consent" checked={enquiryConsent} onChange={setEnquiryConsent} />
      <ConsentCheckbox
        id="marketing_consent"
        required={false}
        checked={marketingConsent}
        onChange={setMarketingConsent}
        wording={MARKETING_CONSENT_WORDING}
      />
      <p className="text-xs leading-relaxed text-fg-subtle">{PRIVACY_WORDING}</p>
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
  successBody = 'We will confirm availability and pricing within one business day.',
}: {
  formName?: FormName;
  subject: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
}) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '', subject });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <FormShell
      formName={formName}
      fields={{ ...values, consent, [HONEYPOT_FIELD]: honey }}
      submitLabel={submitLabel}
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
        placeholder="Anything specific about your setup or timing."
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
