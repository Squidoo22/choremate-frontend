/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // preflight вимкнено, щоб не скидати легасі-CSS з index.css
  corePlugins: { preflight: false },
  // important:#root — утиліти перемагають легасі .app-shell правила без !important
  important: "#root",
  theme: {
    extend: {
      // Токени зі стайлгайду ChoreMate (StyleGuideView)
      colors: {
        canvas: "#FAF8F5",
        stone: { 850: "#211d1b" },
        brand: {
          DEFAULT: "#e11d48",
          soft: "#fff1f2",
          strong: "#be123c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      // Сумісність із назвами тіней Tailwind v4, що використовує дизайн
      boxShadow: {
        "2xs": "0 1px rgb(0 0 0 / 0.05)",
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      // Дизайн використовує hover:scale-102
      scale: { 102: "1.02" },
      // Заміна v4-класу `animate-in fade-in duration-300` -> `animate-fade-in`
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
