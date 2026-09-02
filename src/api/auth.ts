import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

// Бекенд повертає AuthResponseDto {accessToken, refreshToken, expiresIn, tokenType, user}.
// Фронт очікує {token, user}, тож приводимо форму й зберігаємо refresh-токен.
function normalizeAuth(res) {
  const { accessToken, refreshToken, user } = res.data;
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  return { data: { token: accessToken, user, refreshToken } };
}

export function register({ email, password, name }) {
  if (USE_MOCKS) return mock.register({ email, password, name });
  return client.post("/auth/register", { email, password, name }).then(normalizeAuth);
}

export function login({ email, password }) {
  if (USE_MOCKS) return mock.login({ email, password });
  return client.post("/auth/login", { email, password }).then(normalizeAuth);
}

// Вхід через Google за ID-токеном, який клієнт отримав від Google Identity Services.
export function loginWithGoogle(idToken) {
  if (USE_MOCKS) return mock.login({ email: "google@example.com", password: "google" });
  return client.post("/auth/google", { idToken }).then(normalizeAuth);
}

export function getMe() {
  if (USE_MOCKS) return mock.login({ email: "demo@example.com", password: "demodemo" });
  return client.get("/auth/me");
}

export function refresh() {
  const refreshToken = localStorage.getItem("refreshToken");
  return client.post("/auth/refresh", { refreshToken }).then(normalizeAuth);
}

// Вихід: анулюємо refresh-токен на бекенді й чистимо локальну сесію.
export function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  localStorage.removeItem("refreshToken");
  if (USE_MOCKS || !refreshToken) return Promise.resolve();
  return client.post("/auth/logout", { refreshToken }).catch(() => {});
}
