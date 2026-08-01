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
