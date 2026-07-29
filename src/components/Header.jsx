import { APP_NAME } from "../config";

function formatToday() {
  return new Date().toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-logo" aria-hidden="true">
            CM
          </span>
          <span className="app-header__titles">
            <span className="app-header__title">{APP_NAME}</span>
            <span className="app-header__tagline">Спільні обов'язки без суперечок</span>
          </span>
        </div>
        <time className="app-header__date">{formatToday()}</time>
      </div>
    </header>
  );
}
