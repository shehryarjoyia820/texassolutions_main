'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { submitForm } from '@/lib/forms';
import { Button, Container, Section } from '@/components/ui';

export function NewsletterBlock() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  return (
    <Section tone="soft" id="newsletter">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4 justify-center">Newsletter</p>
          <h2 className="text-display-sm">One email, every other week</h2>
          <p className="mt-4 leading-relaxed text-fg-muted">
            What moved on the dispatch desk, what changed in ad platform measurement, and one number worth
            knowing. No sequence, no upsell, one click to leave.
          </p>

          {state === 'done' ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-8 inline-flex items-center gap-2 rounded-xl border border-success/35 bg-success/10 px-5 py-3.5 text-sm text-success"
            >
              <Check className="h-4 w-4" aria-hidden />
              You are on the list. Check your inbox to confirm.
            </motion.p>
          ) : (
            <form
              className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row"
              onSubmit={async (e) => {
                e.preventDefault();
                setState('sending');
                const res = await submitForm({ form: 'newsletter', fields: { email, source: 'insights' } });
                setState(res.ok ? 'done' : 'error');
              }}
            >
              <label htmlFor="insights-email" className="sr-only">
                Email address
              </label>
              <input
                id="insights-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-12 flex-1 rounded-xl border border-line bg-bg px-4 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
              />
              <Button type="submit" className="h-12" disabled={state === 'sending'} icon={ArrowRight} iconRight>
                {state === 'sending' ? 'Sending' : 'Subscribe'}
              </Button>
            </form>
          )}

          {state === 'error' && (
            <p className="mt-3 text-xs text-danger">
              That did not send. Please try again, or email us directly.
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
