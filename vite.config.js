// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5191,        // start here
    strictPort: false, // if busy, pick next free port automatically
    host: '0.0.0.0',
  },
  preview: {
    port: 4191,
    host: '0.0.0.0',
  },
  define: {
    'process.env': {},
  },
});
