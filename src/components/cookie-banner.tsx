'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getConsent, setConsent } from '@/lib/analytics';
import { Button } from './ui';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only shown when no decision has been recorded yet.
    const timer = setTimeout(() => setVisible(getConsent() === null), 900);
    return () => clearTimeout(timer);
  }, []);

  const decide = (state: 'granted' | 'denied') => {
    setConsent(state);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-line bg-bg-elev/[0.97] p-5 shadow-lift backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-display text-sm font-semibold">We only measure if you say yes</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                Essential cookies keep the site working. Analytics cookies help us see which pages earn
                enquiries, and they stay off until you accept. Read the{' '}
                <Link href="/privacy" className="text-accent underline underline-offset-4">
                  privacy policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 gap-2.5">
              <Button variant="secondary" size="sm" onClick={() => decide('denied')}>
                Essential only
              </Button>
              <Button size="sm" onClick={() => decide('granted')}>
                Accept analytics
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
