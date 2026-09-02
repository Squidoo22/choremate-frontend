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
  const { data } = await axios.post(
    `${client.defaults.baseURL}/auth/refresh`,
    { refreshToken },
    { timeout: 10000 }
  );
  if (!data?.accessToken) throw new Error("refresh_no_token");
  localStorage.setItem("token", data.accessToken);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  return data.accessToken;
}

function clearSession() {
  // Якщо токенів уже нема — сесію очистив попередній 401; не дублюємо подію/тост.
  if (!localStorage.getItem("token") && !localStorage.getItem("refreshToken")) return;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  // Повідомляємо застосунок, що сесія завершилась: гард маршрутів зробить редірект,
  // а слухач покаже тост про необхідність повторної авторизації.
  window.dispatchEvent(new CustomEvent("auth:logout", { detail: { reason: "session_expired" } }));
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const is401 = response?.status === 401 && config && !isAuthFree(config.url);

    // Спроба автоматичного оновлення токена при 401 (один раз на запит).
    if (is401 && !config._retry && localStorage.getItem("refreshToken")) {
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

    // 401 без можливості рефрешу (немає refresh-токена або повторна невдача) —
    // примусово завершуємо сесію й просимо авторизуватись повторно.
    if (is401) {
      clearSession();
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
