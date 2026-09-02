import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useHousehold } from "../context/HouseholdContext";
import { joinHousehold } from "../api/households";

// Обробляє інвайт-посилання /join/:code. Роут під RequireAuth: неавторизованого
// спершу відправить на /login, а після входу поверне сюди ж (через location.state.from)
// і приєднання відбудеться автоматично.
export default function JoinHousehold() {
  const { code } = useParams();
  const { user } = useAuth();
  const { switchHousehold, reload } = useHousehold();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current || !user || !code) return;
    handled.current = true;

    joinHousehold(code)
      .then((res) => {
        const hh = res.data?.household;
        if (hh?.id) switchHousehold(hh.id);
        else reload?.();
        navigate("/dashboard", { replace: true });
      })
      .catch(() => setError(true));
  }, [user, code, navigate, switchHousehold, reload]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 p-6 text-center">
      {error ? (
        <>
          <p className="text-sm text-rose-600">{t("household.err_join")}</p>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold no-underline"
          >
            {t("onboarding.go_dashboard")}
          </Link>
        </>
      ) : (
        <p className="text-sm text-stone-500">{t("auth.loading")}</p>
      )}
    </div>
  );
}
