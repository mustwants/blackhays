// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,         // Lock to known safe dev port
    strictPort: true,   // Fail if port is unavailable
    host: '0.0.0.0',    // Allow access from Codex/browsers
    hmr: {
      protocol: 'ws',   // WebSocket protocol (Codex-safe)
      host: 'localhost',
      port: 5173,
    }
  },
  preview: {
    port: 4173,         // Default Vite preview port
    host: '0.0.0.0'     // Enable access from outside container
  },
  define: {
    'process.env': {}   // Prevent 'process is not defined' errors
  }
});


