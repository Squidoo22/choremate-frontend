import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { USE_MOCKS, API_BASE } from "../config";
import LanguageSwitcher from "./LanguageSwitcher";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const inputClass =
  "w-full pl-10 pr-3 py-2.5 md:py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm md:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400 transition";

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="text-xs md:text-sm font-semibold text-stone-700 flex items-center gap-1">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="relative mt-1.5">
        <Icon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        {children}
      </div>
    </div>
  );
}

export default function AuthScreen({ initialMode = "login" }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = mode === "login";
  const from = location.state?.from?.pathname || "/dashboard";

  const features = [
    {
      icon: HeartHandshake,
      tint: "bg-rose-500/20 text-rose-300",
      title: t("auth.feature_trust_title"),
      subtitle: t("auth.feature_trust_sub"),
    },
    {
      icon: Sparkles,
      tint: "bg-amber-500/20 text-amber-300",
      title: t("auth.feature_game_title"),
      subtitle: t("auth.feature_game_sub"),
    },
    {
      icon: CheckCircle2,
      tint: "bg-emerald-500/20 text-emerald-300",
      title: t("auth.feature_balance_title"),
      subtitle: t("auth.feature_balance_sub"),
    },
  ];

  function switchMode(next) {
    setMode(next);
    setError(null);
  }

  function apiError(err, fallbackKey = "auth.err_generic") {
    const data = err?.response?.data;
    if (data?.error === "invalid_credentials") return t("auth.err_invalid");
    // Бекенд повертає людяне повідомлення (напр. правила пароля) — показуємо його.
    const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
    if (typeof msg === "string" && msg) return msg;
    return t(fallbackKey);
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError(t("auth.err_email"));
      return;
    }
    if (!password || password.length < 6) {
      setError(t("auth.err_password"));
      return;
    }
    if (mode === "register") {
      if (!name.trim()) {
        setError(t("auth.err_name"));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("auth.err_mismatch"));
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const { data } = await apiLogin({ email: email.trim().toLowerCase(), password });
        loginUser(data.token, data.user);
        navigate(from, { replace: true });
      } else {
        const { data } = await apiRegister({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });
        loginUser(data.token, data.user);
        navigate("/onboarding");
      }
    } catch (err) {
      setError(apiError(err));
      setIsLoading(false);
    }
  }

  async function handleGoogleAuth() {
    // У реальному режимі стартуємо серверний OAuth-редірект на Google.
    if (!USE_MOCKS) {
      window.location.href = `${API_BASE}/auth/google`;
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiLogin({ email: "google@example.com", password: "google" });
      loginUser(data.token, data.user);
      navigate(isLogin ? from : "/onboarding", { replace: true });
    } catch (err) {
      setError(apiError(err, "auth.err_google"));
      setIsLoading(false);
    }
  }

  async function handleDemo() {
    setIsLoading(true);
    try {
      const { data } = await apiLogin({ email: "demo@example.com", password: "demodemo" });
      loginUser(data.token, data.user);
      navigate("/dashboard");
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-4xl w-full bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid md:grid-cols-12">
        <aside className="hidden md:flex md:col-span-5 bg-stone-900 text-white p-8 flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="absolute left-0 bottom-0 -translate-x-12 translate-y-12 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center font-extrabold text-lg shadow-lg">
                CM
              </div>
              <span className="text-2xl font-bold tracking-tight">ChoreMate</span>
            </div>
            <p className="text-stone-300 text-sm md:text-base mt-6 leading-relaxed">
              {t("auth.banner_tagline")}
            </p>
          </div>

          <div className="relative z-10 my-8 space-y-3.5">
            {features.map(({ icon: Icon, tint, title, subtitle }) => (
              <div
                key={title}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm"
              >
                <div
                  className={`w-8 h-8 rounded-xl ${tint} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs md:text-sm">
                  <div className="font-bold text-white">{title}</div>
                  <div className="text-stone-400 text-[11px] md:text-xs">{subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-2 text-stone-400 text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            {t("auth.security")}
          </div>
        </aside>

        <section className="md:col-span-7 p-6 sm:p-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
              {isLogin ? t("auth.welcome_login") : t("auth.welcome_register")}
            </h2>
            <p className="text-xs md:text-sm text-stone-500 mt-1">
              {isLogin ? t("auth.subtitle_login") : t("auth.subtitle_register")}
            </p>
          </div>

          <div className="bg-stone-100 p-1 rounded-2xl grid grid-cols-2 gap-1 mt-6 mb-6 text-xs md:text-sm font-bold">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                isLogin ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {t("auth.tab_login")}
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                !isLogin ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {t("auth.tab_register")}
            </button>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 rounded-2xl text-stone-700 font-semibold text-sm md:text-base flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
          >
            <GoogleIcon />
            <span>{isLogin ? t("auth.google_login") : t("auth.google_register")}</span>
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[10px] md:text-xs font-bold text-stone-400 tracking-wider">
              {t("auth.divider")}
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {!isLogin && (
              <Field label={t("auth.name")} icon={User}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.name_placeholder")}
                  className={inputClass}
                />
              </Field>
            )}

            <Field label={t("auth.email")} icon={Mail}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass}
              />
            </Field>

            <Field label={t("auth.password")} icon={Lock}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Field>

            {!isLogin && (
              <Field label={t("auth.confirm")} icon={Lock}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </Field>
            )}

            {error && (
              <p className="text-xs md:text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 md:py-3.5 px-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-sm md:text-base rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-60"
            >
              {isLoading ? t("auth.loading") : isLogin ? t("auth.submit_login") : t("auth.submit_register")}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-xs md:text-sm text-stone-500 mt-5">
            {t("auth.demo_prefix")}{" "}
            <button
              type="button"
              onClick={handleDemo}
              className="font-semibold text-rose-600 hover:text-rose-700"
            >
              {t("auth.demo_action")}
            </button>
          </p>

        </section>
      </div>
    </div>
  );
}
