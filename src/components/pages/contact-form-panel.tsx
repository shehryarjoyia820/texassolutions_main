'use client';

import { useSearchParams } from 'next/navigation';
import { ContactForm } from '@/components/forms';
import { SERVICES } from '@/data/services';

/**
 * Wraps the contact form so a ?service= or ?subject= parameter arrives
 * pre-selected. Kept separate from the page so only this piece needs Suspense.
 */
export function ContactFormPanel() {
  const params = useSearchParams();
  const service = params.get('service') ?? '';
  const valid = SERVICES.some((s) => s.slug === service) ? service : '';

  return <ContactForm defaultService={valid} />;
}
