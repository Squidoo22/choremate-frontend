import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { APP_NAME } from "../config";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const locale = i18n.language?.startsWith("en") ? "en-US" : "uk-UA";
  const today = new Date().toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function handleLogout() {
    logoutUser();
    localStorage.removeItem("householdId");
    navigate("/login", { replace: true });
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-logo" aria-hidden="true">
            CM
          </span>
          <span className="app-header__titles">
            <span className="app-header__title-row">
              <span className="app-header__title">{APP_NAME}</span>
              {user?.points != null && (
                <span className="credit-badge" title={t("header.credit")}>
                  🏆 {user.points}
                </span>
              )}
            </span>
            <span className="app-header__tagline">{t("app.tagline")}</span>
          </span>
        </div>

        <div className="app-header__actions">
          <time className="app-header__date">{today}</time>
          <LanguageSwitcher />
          {user && (
            <div className="user-chip">
              <span className="user-chip__avatar" aria-hidden="true">
                {user.avatar || "🙂"}
              </span>
              <span className="user-chip__name">{user.name}</span>
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
                aria-label={t("header.logout")}
              >
                <LogOut className="logout-btn__icon" aria-hidden="true" />
                <span className="logout-btn__label">{t("header.logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
