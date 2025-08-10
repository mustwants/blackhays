// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5191,
    strictPort: true,   // fail if 5191 is busy (don’t hop to 517x)
    host: '0.0.0.0'
  },
  preview: {
    port: 4191,
    host: '0.0.0.0'
  }
})

