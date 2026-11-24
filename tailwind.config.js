import { palette, fontFamily, shadows } from './src/art/palette.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/ios/**",
  ],
  theme: {
    extend: { colors: palette, fontFamily: { rubik: fontFamily }, boxShadow: shadows },
  },
  plugins: [],
}
