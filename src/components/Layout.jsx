import Header from "./Header";
import Footer from "./Footer";

// Спільна обгортка: липкий хедер зверху, футер знизу,
// контент сторінки — посередині. Адаптивна під мобілку.
export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}
