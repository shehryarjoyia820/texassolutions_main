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
          className="fixed inset-x-0 bottom-0 z-[80] border-t border-line bg-bg-elev/[0.98] px-4 py-3 shadow-lift backdrop-blur-xl sm:px-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex-1">
              <p className="text-xs leading-relaxed text-fg-muted sm:text-sm">
                <span className="font-semibold text-fg">Analytics cookies stay off unless you accept.</span>{' '}
                Essential cookies keep the site working. See the{' '}
                <Link href="/privacy" className="text-accent underline underline-offset-4">
                  privacy policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
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
