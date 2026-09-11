import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: 'src/ios',
  plugins: [react()],
  build: {
    outDir: '../../dist-ios',
    emptyOutDir: true,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({ content: ['./src/ios/**/*.{html,js,ts,jsx,tsx}'] }),
        autoprefixer(),
      ],
    },
  },
});
