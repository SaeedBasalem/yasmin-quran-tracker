import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
// `base` is set for GitHub Pages project-site hosting (https://<user>.github.io/<repo>/).
// Override with an env var when deploying elsewhere (e.g. VITE_BASE=/ for a root domain).
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE ?? '/yasmin-quran-tracker/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    target: 'es2020',
  },
  server: {
    port: 5173,
    open: true,
  },
}))
