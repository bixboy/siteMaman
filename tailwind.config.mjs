import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#f9f6f1',
        charcoal: '#2d2a26',
        clay: '#b05c44',
        linen: '#ede7dd'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', ...fontFamily.serif],
        sans: ['"Work Sans"', ...fontFamily.sans]
      }
    }
  },
  plugins: []
};
