import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5176,
    proxy: {
      '/api': {
        target: 'https://gemini-backend-1-gq8i.onrender.com/api',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
