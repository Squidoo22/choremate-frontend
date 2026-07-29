/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Preflight вимкнено, щоб Tailwind не скидав наявні кастомні стилі
  // (дашборд, статистика тощо написані на звичайному CSS у index.css).
  corePlugins: { preflight: false },
  theme: {
    extend: {},
  },
  plugins: [],
};
