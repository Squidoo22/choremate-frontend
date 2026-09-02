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
    // Мобілка: фіксований таб-бар, приклеєний до низу екрана.
    // sm+: повертаємось до горизонтальних «пігулок» зверху, як було.
    <nav className="sm:max-w-4xl sm:w-full sm:mx-auto sm:px-4 sm:pt-4">
      <div
        className="
          fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around
          bg-white border-t border-stone-200 px-1 pt-1.5
          pb-[calc(0.375rem+env(safe-area-inset-bottom))]
          shadow-[0_-1px_4px_rgba(0,0,0,0.06)]
          sm:static sm:items-center sm:justify-start sm:gap-1
          sm:border sm:border-stone-200 sm:rounded-2xl sm:p-2
          sm:shadow-sm sm:overflow-x-auto sm:pb-2
        "
      >
        {TABS.map(({ to, key, Icon, emoji, iconClass }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `no-underline transition-all flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1 rounded-xl font-bold sm:flex-row sm:flex-none sm:gap-2 sm:px-4 sm:py-2 ${
                isActive
                  ? "text-rose-600 sm:text-white sm:bg-rose-600 sm:shadow-xs"
                  : "text-stone-500 sm:text-stone-600 sm:hover:bg-stone-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 sm:w-4 sm:h-4 ${isActive ? "" : iconClass || ""}`} />
                <span className="w-full text-center truncate text-[10px] leading-none sm:w-auto sm:text-sm">
                  {t(key)}
                  <span className="hidden sm:inline">{emoji ? ` ${emoji}` : ""}</span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
