/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
    './stores/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'pure-black': '#111827',
        'pure-white': '#ffffff',
        'bd-green': '#006a4e',
        'soft-grey': '#f9fafb',
        /**
         * Brand green scale — anchored on bd-green (#006a4e) as the 700 shade.
         * Use `brand-*` in place of Tailwind's default `emerald-*` / `green-*`
         * so every accent traces back to a single, on-brand palette.
         */
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10a978',
          600: '#008660',
          700: '#006a4e', // bd-green (national colour)
          800: '#00543e',
          900: '#003d2d',
        },
        /**
         * Semantic scopes — always use these instead of raw red/amber/blue.
         * `danger-*`  = destructive actions + hard-error states.
         * `warning-*` = drafts, pending review, soft-warning states.
         * `info-*`    = neutral/informational status pills (draft, archived).
         */
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        info: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans Bengali"', 'Inter', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
