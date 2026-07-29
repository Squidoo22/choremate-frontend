// Глобальні налаштування застосунку.
// Поки бекенд не готовий — працюємо на моках.
// Щоб перемкнутись на реальний API, виставте VITE_USE_MOCKS=false у .env
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

// Назва застосунку — використовується в хедері/футері.
export const APP_NAME = "ChoreMate";
