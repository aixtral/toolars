import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        porcelain: '#FAFAFC',
        brand: {
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          900: '#0B1220',
        },
        accent: {
          ai: '#2563EB',
          finance: '#F59E0B',
          health: '#22C55E',
        },
        success: '#16A34A',
        info: '#2563EB',
        warning: '#F59E0B',
        danger: '#EF4444',
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          600: '#475569',
          700: '#334155',
          900: '#0F172A',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        toolars:
          '0 4px 6px -1px rgba(15,23,42,.08), 0 2px 4px -2px rgba(15,23,42,.08)',
      },
      maxWidth: {
        content: '1240px',
      },
    },
  },
};

export default config;
