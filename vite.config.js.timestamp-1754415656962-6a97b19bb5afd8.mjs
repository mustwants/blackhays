// vite.config.js
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Lock to known safe dev port
    strictPort: true,
    // Fail if port is unavailable
    host: "0.0.0.0",
    // Allow access from Codex/browsers
    hmr: {
      protocol: "ws",
      // WebSocket protocol (Codex-safe)
      host: "localhost",
      port: 5173
    }
  },
  preview: {
    port: 4173,
    // Default Vite preview port
    host: "0.0.0.0"
    // Enable access from outside container
  },
  define: {
    "process.env": {}
    // Prevent 'process is not defined' errors
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcuanNcIjsvLyB2aXRlLmNvbmZpZy5qc1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsICAgICAgICAgLy8gTG9jayB0byBrbm93biBzYWZlIGRldiBwb3J0XG4gICAgc3RyaWN0UG9ydDogdHJ1ZSwgICAvLyBGYWlsIGlmIHBvcnQgaXMgdW5hdmFpbGFibGVcbiAgICBob3N0OiAnMC4wLjAuMCcsICAgIC8vIEFsbG93IGFjY2VzcyBmcm9tIENvZGV4L2Jyb3dzZXJzXG4gICAgaG1yOiB7XG4gICAgICBwcm90b2NvbDogJ3dzJywgICAvLyBXZWJTb2NrZXQgcHJvdG9jb2wgKENvZGV4LXNhZmUpXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgIHBvcnQ6IDUxNzMsXG4gICAgfVxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgcG9ydDogNDE3MywgICAgICAgICAvLyBEZWZhdWx0IFZpdGUgcHJldmlldyBwb3J0XG4gICAgaG9zdDogJzAuMC4wLjAnICAgICAvLyBFbmFibGUgYWNjZXNzIGZyb20gb3V0c2lkZSBjb250YWluZXJcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Jzoge30gICAvLyBQcmV2ZW50ICdwcm9jZXNzIGlzIG5vdCBkZWZpbmVkJyBlcnJvcnNcbiAgfVxufSk7XG5cblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixZQUFZO0FBQUE7QUFBQSxJQUNaLE1BQU07QUFBQTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsVUFBVTtBQUFBO0FBQUEsTUFDVixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsRUFDUjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZSxDQUFDO0FBQUE7QUFBQSxFQUNsQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
