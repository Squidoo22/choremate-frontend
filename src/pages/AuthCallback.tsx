import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../api/auth";

// Куди бекенд редіректить після успішного Google OAuth
// (GOOGLE_SUCCESS_REDIRECT_URL) з access_token і expires_in у query.
export default function AuthCallback() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return; // захист від подвійного виклику effect
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const expiresIn = Number(params.get("expires_in"));

    // Одразу чистимо URL — інакше токен назавжди осяде в історії браузера й закладках.
    window.history.replaceState({}, document.title, window.location.pathname);

    // Немає токена — це шлях помилки, ведемо на сторінку входу.
    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    // Кладемо токен туди, звідки його бере HTTP-клієнт (src/api/client.js).
    localStorage.setItem("token", accessToken);
    if (expiresIn) {
      localStorage.setItem("tokenExpiresAt", String(Date.now() + expiresIn * 1000));
    }

    // Профіль підтягуємо через /auth/me — токен уже в localStorage, тож інтерсептор його додасть.
    getMe()
      .then(({ data }) => {
        loginUser(accessToken, data);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiresAt");
        navigate("/login", { replace: true });
      });
  }, [navigate, loginUser]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-stone-500 text-sm">
      {t("auth.loading")}
    </div>
  );
}
