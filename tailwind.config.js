/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Preflight вимкнено, щоб Tailwind не скидав наявні кастомні стилі
  // (частина застосунку написана на звичайному CSS у index.css).
  corePlugins: { preflight: false },
  // Утиліти отримують префікс `#root`, тож надійно перемагають легасі
  // element-правила (`.app-shell button/input`) без !important.
  important: "#root",
  theme: {
    extend: {},
  },
  plugins: [],
};
