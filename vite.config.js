import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Use root path for local dev, /voyage-du-heros/ for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/voyage-du-heros/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
