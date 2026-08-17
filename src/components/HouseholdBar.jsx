import { useTranslation } from "react-i18next";
import Avatar from "./Avatar";

export default function HouseholdBar({ members = [], currentUserId, onSelectMember }) {
  const { t } = useTranslation();
  if (!members.length) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-stone-500 mb-2">{t("household.you_as")}</p>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => {
          const selected = m.userId === currentUserId;
          return (
            <button
              key={m.userId}
              type="button"
              onClick={() => onSelectMember?.(m.userId)}
              aria-pressed={selected}
              className={`flex flex-col items-center gap-1.5 w-20 py-3 rounded-2xl border border-solid transition ${
                selected
                  ? "border-rose-400 bg-rose-50"
                  : "border-stone-200 bg-white hover:bg-stone-50"
              }`}
            >
              <Avatar
                name={m.name}
                seed={m.userId}
                src={m.avatarUrl || m.user?.avatarUrl}
                emoji={m.avatar || m.user?.avatar}
                size={40}
                className={selected ? "ring-2 ring-rose-400" : ""}
              />
              <span className="text-xs font-semibold text-stone-700">{m.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
