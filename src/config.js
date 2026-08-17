export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export const API_BASE =
  import.meta.env.VITE_API_URL || "https://choremate-backend-liart.vercel.app/api/v1";

export const APP_NAME = "ChoreMate";

export const TEST_CREDENTIALS = {
  email: "test@choremate.app",
  password: "test1234",
};
