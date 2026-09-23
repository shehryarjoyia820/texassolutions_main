'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_REGION, REGION_CODES, getRegion, guessRegionFromLocale, type Region, type RegionCode } from '@/data/regions';
import { trackRegionChange } from '@/lib/analytics';

/* ------------------------------------------------------------------ */
/*  Theme (light only)                                                 */
/* ------------------------------------------------------------------ */

// The site has a single light theme. THEME_KEY is only used to clear a preference
// stored by the old dark/light toggle.
const THEME_KEY = 'ts-theme';

/* ------------------------------------------------------------------ */
/*  Region                                                             */
/* ------------------------------------------------------------------ */

interface RegionCtx {
  code: RegionCode;
  region: Region;
  setRegion: (code: RegionCode) => void;
  /** False until the stored or detected preference has loaded. */
  ready: boolean;
}

const RegionContext = createContext<RegionCtx>({
  code: DEFAULT_REGION,
  region: getRegion(DEFAULT_REGION),
  setRegion: () => {},
  ready: false,
});
export const useRegion = () => useContext(RegionContext);

const REGION_KEY = 'ts-region';

/* ------------------------------------------------------------------ */

export function Providers({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<RegionCode>(DEFAULT_REGION);
  const [ready, setReady] = useState(false);

  // Light is the only theme. Remove any dark/light choice remembered by the old toggle.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    try {
      window.localStorage.removeItem(THEME_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Region: stored choice wins, then a URL parameter, then the browser locale.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(REGION_KEY);
    } catch {
      /* ignore */
    }
    const fromUrl = new URLSearchParams(window.location.search).get('region');
    const candidate = (fromUrl || stored || '').toUpperCase();
    const valid = (REGION_CODES as string[]).includes(candidate);
    setCode(valid ? (candidate as RegionCode) : guessRegionFromLocale(navigator.language));
    setReady(true);
  }, []);

  const setRegion = useCallback((next: RegionCode) => {
    setCode(next);
    try {
      window.localStorage.setItem(REGION_KEY, next);
    } catch {
      /* ignore */
    }
    trackRegionChange(next);
  }, []);

  const regionValue = useMemo(
    () => ({ code, region: getRegion(code), setRegion, ready }),
    [code, setRegion, ready],
  );

  return (
    <RegionContext.Provider value={regionValue}>{children}</RegionContext.Provider>
  );
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
