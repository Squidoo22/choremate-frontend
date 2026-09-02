import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Бекенд не віддає CORS-заголовки (Access-Control-Allow-Origin) для браузерних
// запитів, тож у dev проксуємо /api на прод-бекенд — запити стають same-origin.
const BACKEND = "https://choremate-backend-liart.vercel.app";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // SW сам оновлюється при новому деплої
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "ChoreMate — спільні обов'язки без суперечок",
        short_name: "ChoreMate",
        description:
          "Платформа гармонійного розподілу домашніх обов'язків без суперечок та закидів",
        lang: "uk",
        theme_color: "#f43f5e",
        background_color: "#FAF8F5",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: "favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
        ],
      },
      workbox: {
        // SPA-навігація повертає index.html, але запити до API мають іти в мережу.
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
      },
    }),
  ],
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
