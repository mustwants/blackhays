// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5191,
    strictPort: true,
    host: '0.0.0.0'
  },
  preview: {
    port: 4191,
    host: '0.0.0.0'
  }
})

