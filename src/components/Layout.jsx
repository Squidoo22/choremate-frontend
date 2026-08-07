import Header from "./Header";
import Footer from "./Footer";
import TabNav from "./TabNav";

export default function Layout({ children, showTabs = false }) {
  return (
    <div className="app-shell">
      <Header />
      {showTabs && <TabNav />}
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}
