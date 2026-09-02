export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

// За замовчуванням — відносний шлях: у dev його проксує Vite (vite.config.js),
// у проді — Vercel (vercel.json). Так уникаємо CORS в обох середовищах.
export const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

export const APP_NAME = "ChoreMate";

export const TEST_CREDENTIALS = {
  email: "test@choremate.app",
  password: "test1234",
};
