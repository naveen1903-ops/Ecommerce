import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set VITE_BASE_PATH=/repository-name/ for a GitHub Pages project site.
// Netlify, Vercel, and a GitHub Pages user/custom domain use '/'.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
  },
});
