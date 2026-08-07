import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ListTodo, ShieldAlert, BarChart3, Gift, Trophy } from "lucide-react";

const TABS = [
  { to: "/dashboard", key: "nav.tasks", Icon: ListTodo },
  { to: "/debts", key: "nav.debts", Icon: ShieldAlert, emoji: "🤝", iconClass: "text-orange-400" },
  { to: "/statistics", key: "nav.stats", Icon: BarChart3, emoji: "📊" },
  { to: "/wishlist", key: "nav.wishlist", Icon: Gift, emoji: "🎁" },
  { to: "/gamification", key: "nav.gamification", Icon: Trophy, emoji: "🏆", iconClass: "text-amber-400" },
];

export default function TabNav() {
  const { t } = useTranslation();

  return (
    <nav className="max-w-4xl w-full mx-auto px-4 pt-4">
      <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-2xl p-2 shadow-sm overflow-x-auto">
        {TABS.map(({ to, key, Icon, emoji, iconClass }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap no-underline ${
                isActive
                  ? "bg-rose-600 text-white shadow-xs scale-102"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 ${isActive ? "" : iconClass || ""}`} />
                <span>
                  {t(key)}
                  {emoji ? ` ${emoji}` : ""}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
