import axios from "axios";
import { API_BASE } from "../config";

const client = axios.create({
  baseURL: API_BASE,
});

// Ендпоінти, до яких не додаємо access-токен і не намагаємось робити рефреш.
const AUTH_FREE = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/google"];

function isAuthFree(url = "") {
  return AUTH_FREE.some((p) => url.startsWith(p));
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !isAuthFree(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Один спільний запит на рефреш, щоб паралельні 401 не породжували гонку.
let refreshing = null;

async function refreshTokens() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("no_refresh_token");
  const { data } = await axios.post(`${client.defaults.baseURL}/auth/refresh`, { refreshToken });
  localStorage.setItem("token", data.accessToken);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  return data.accessToken;
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  // Повідомляємо застосунок, що сесія завершилась — гард маршрутів зробить редірект.
  window.dispatchEvent(new Event("auth:logout"));
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Спроба автоматичного оновлення токена при 401 (один раз на запит).
    if (
      response?.status === 401 &&
      config &&
      !config._retry &&
      !isAuthFree(config.url) &&
      localStorage.getItem("refreshToken")
    ) {
      config._retry = true;
      try {
        refreshing = refreshing || refreshTokens();
        const newToken = await refreshing;
        refreshing = null;
        config.headers.Authorization = `Bearer ${newToken}`;
        return client(config);
      } catch (refreshErr) {
        refreshing = null;
        clearSession();
        return Promise.reject(refreshErr);
      }
    }

    // Нормалізуємо повідомлення бекенду ({statusCode,error,message,...}) у зручне
    // поле `error`, яке очікують форми на фронті.
    const data = response?.data;
    if (data && typeof data === "object" && data.message) {
      data.error = Array.isArray(data.message) ? data.message[0] : data.message;
    }

    return Promise.reject(error);
  }
);

export default client;
