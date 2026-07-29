import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "uk", label: "UA", flag: "🇺🇦" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

// Сегментований перемикач мови (UA/EN). Мова зберігається в localStorage
// автоматично (LanguageDetector), тож вибір лишається між сесіями.
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "uk";

  return (
    <div className="lang-switch" role="group" aria-label={t("lang.switch")}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-switch__btn ${current === l.code ? "is-active" : ""}`}
          onClick={() => i18n.changeLanguage(l.code)}
          aria-pressed={current === l.code}
        >
          <span aria-hidden="true">{l.flag}</span>
          {l.label}
        </button>
      ))}
    </div>
  );
}
