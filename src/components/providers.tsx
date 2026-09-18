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
import { DEFAULT_REGION, getRegion, guessRegionFromLocale, type Region, type RegionCode } from '@/data/regions';
import { trackRegionChange } from '@/lib/analytics';

/* ------------------------------------------------------------------ */
/*  Theme                                                              */
/* ------------------------------------------------------------------ */

type Theme = 'dark' | 'light';

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {}, setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

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
  const [theme, setThemeState] = useState<Theme>('dark');
  const [code, setCode] = useState<RegionCode>(DEFAULT_REGION);
  const [ready, setReady] = useState(false);

  // Theme: restore the remembered choice, else follow the system.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(THEME_KEY);
    } catch {
      /* private mode */
    }
    // Dark is the brand default. Light is available and remembered once chosen.
    const initial: Theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    setThemeState(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

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
    const valid = ['US', 'UK', 'CA', 'AU', 'EU'].includes(candidate);
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

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(() => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const themeValue = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme]);
  const regionValue = useMemo(
    () => ({ code, region: getRegion(code), setRegion, ready }),
    [code, setRegion, ready],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <RegionContext.Provider value={regionValue}>{children}</RegionContext.Provider>
    </ThemeContext.Provider>
  );
}

/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong colours. Injected as an inline script in the root layout.
 */
export const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('${THEME_KEY}');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    document.documentElement.classList.add(t);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;
