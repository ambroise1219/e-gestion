/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'pro-black': {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
          dark: '#374151',
          card: '#1F2937'
        },
        'pro-lime': {
          DEFAULT: '#CCFF00',
          light: '#D4FF1F',
          dark: '#B8E600',
        },
        'pro-white': {
          DEFAULT: '#FFFFFF',
          off: '#F5F5F5',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
}
