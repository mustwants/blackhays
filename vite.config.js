// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,          // Dev server (npm run dev)
    strictPort: true     // Fail if 3000 is taken
  },
  preview: {
    port: 4173           // Preview server (npm start)
  },
  define: {
    'process.env': {}    // Optional: if legacy packages rely on process.env
  }
});

