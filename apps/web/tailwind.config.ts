import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf7ff',
          100: '#cfe7ff',
          200: '#9fd0ff',
          300: '#6fb8ff',
          400: '#3fa0ff',
          500: '#0f88ff',
          600: '#006fdc',
          700: '#0055a8',
          800: '#003c74',
          900: '#002340'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
