// Глобальні налаштування застосунку.
// Поки бекенд не готовий — працюємо на моках.
// Щоб перемкнутись на реальний API, виставте VITE_USE_MOCKS=false у .env
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

// Назва застосунку — використовується в хедері/футері.
export const APP_NAME = "ChoreMate";

// Тестовий акаунт для входу в мок-режимі (для демо/захисту диплому).
export const TEST_CREDENTIALS = {
  email: "test@choremate.app",
  password: "test1234",
};
