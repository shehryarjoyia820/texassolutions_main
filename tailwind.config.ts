import type { Config } from 'tailwindcss';

/**
 * Design tokens live here and in src/app/globals.css as CSS variables.
 * Colours are declared as `rgb(var(--token) / <alpha-value>)` so every
 * utility supports opacity and both themes swap with one class on <html>.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem', xl: '2.5rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px' },
    },
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1600px',
    },
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        'bg-soft': 'rgb(var(--bg-soft) / <alpha-value>)',
        'bg-elev': 'rgb(var(--bg-elev) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--fg-muted) / <alpha-value>)',
        'fg-subtle': 'rgb(var(--fg-subtle) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)',
        },
        gold: 'rgb(var(--gold) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warn: 'rgb(var(--warn) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        /* per-service accents, also exposed as --svc on service pages */
        svc: 'rgb(var(--svc) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 7vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 5.2vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.875rem, 3.6vw, 2.75rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.625rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.16), 0 8px 24px -12px rgb(0 0 0 / 0.5)',
        lift: '0 24px 60px -24px rgb(0 0 0 / 0.65)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.35), 0 18px 48px -18px rgb(var(--accent) / 0.55)',
        'svc-glow': '0 0 0 1px rgb(var(--svc) / 0.35), 0 18px 48px -18px rgb(var(--svc) / 0.5)',
      },
      spacing: {
        section: 'clamp(4rem, 9vw, 8rem)',
        'section-sm': 'clamp(2.5rem, 6vw, 4.5rem)',
      },
      maxWidth: { prose: '68ch' },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0,14px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        'word-rise': {
          from: { opacity: '0', transform: 'translate3d(0,105%,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 64s linear infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'word-rise': 'word-rise 0.8s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 2.2s infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
