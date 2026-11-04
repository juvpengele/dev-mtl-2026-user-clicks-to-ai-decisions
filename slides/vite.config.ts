import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes the production build work from any folder (or file server) offline.
export default defineConfig({
  base: './',
  plugins: [react()],
})
