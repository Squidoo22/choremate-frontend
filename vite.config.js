import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Бекенд не віддає CORS-заголовки (Access-Control-Allow-Origin) для браузерних
// запитів, тож у dev проксуємо /api на прод-бекенд — запити стають same-origin.
const BACKEND = "https://choremate-backend-liart.vercel.app";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: BACKEND,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
