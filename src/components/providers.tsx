'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { DEFAULT_REGION, getRegion, type Region, type RegionCode } from '@/data/regions';

/* ------------------------------------------------------------------ */
/*  Theme (light only)                                                 */
/* ------------------------------------------------------------------ */

// The site has a single light theme. THEME_KEY is only used to clear a preference
// stored by the old dark/light toggle.
const THEME_KEY = 'ts-theme';

/* ------------------------------------------------------------------ */
/*  Pricing market                                                     */
/* ------------------------------------------------------------------ */

// The site quotes one market only: US dollars. There is no country or region
// switching; useRegion() always returns the US table so components that read
// prices keep working unchanged.
interface RegionCtx {
  code: RegionCode;
  region: Region;
  setRegion: (code: RegionCode) => void;
  ready: boolean;
}

const US_CTX: RegionCtx = { code: DEFAULT_REGION, region: getRegion(DEFAULT_REGION), setRegion: () => {}, ready: true };
const RegionContext = createContext<RegionCtx>(US_CTX);
export const useRegion = () => useContext(RegionContext);

// Key used by the old region switcher; cleared so nobody keeps a stale choice.
const REGION_KEY = 'ts-region';

/* ------------------------------------------------------------------ */

export function Providers({ children }: { children: ReactNode }) {
  // Light is the only theme. Remove any old theme or region choice from storage.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    try {
      window.localStorage.removeItem(THEME_KEY);
      window.localStorage.removeItem(REGION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return <RegionContext.Provider value={US_CTX}>{children}</RegionContext.Provider>;
}

/**
 * Marks the page as light before first paint and clears any old dark preference.
 * Injected as an inline script in the root layout.
 */
export const themeScript = `
(function(){
  try {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.removeItem('${THEME_KEY}');
  } catch (e) {}
})();
`;
