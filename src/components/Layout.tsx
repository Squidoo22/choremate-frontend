import Header from "./Header";
import Footer from "./Footer";
import TabNav from "./TabNav";
import HarmonyAssistant from "./HarmonyAssistant";

export default function Layout({ children, showTabs = false }) {
  return (
    <div className="app-shell">
      <Header />
      {showTabs && <TabNav />}
      <main className={`app-main${showTabs ? " pb-24 sm:pb-0" : ""}`}>{children}</main>
      <Footer />
      <HarmonyAssistant />
    </div>
  );
}
