import { APP_NAME } from "../config";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <span className="app-footer__brand">
          <span className="app-logo app-logo--sm" aria-hidden="true">
            CM
          </span>
          {APP_NAME}
        </span>
        <span className="app-footer__meta">© {year} · Спільні обов'язки без суперечок</span>
      </div>
    </footer>
  );
}
