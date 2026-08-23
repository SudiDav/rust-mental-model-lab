/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        ink: '#080a0f',
        panel: '#10141c',
        line: '#252d3a',
        amberglow: '#fbbf24',
      },
      boxShadow: {
        glow: '0 0 32px rgba(34, 211, 238, 0.12)',
      },
    },
  },
  plugins: [],
};
