/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0d1117',
          text: '#f0f6fc',
          green: '#7ce38b',
          blue: '#58a6ff',
          yellow: '#f2cc60',
          red: '#f85149',
          purple: '#a5a2f6',
          gray: '#8b949e',
        }
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'type': 'type 0.5s steps(40, end)',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'type': {
          'from': { width: '0' },
          'to': { width: '100%' },
        }
      }
    },
  },
  plugins: [],
}
