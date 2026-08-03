import { useTranslation } from "react-i18next";

// Вибір поточного учасника («Ви як»). Селектор сім'ї винесено в хедер.
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
              <span
                className={`w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm ${
                  selected ? "ring-2 ring-rose-400" : ""
                }`}
              >
                {m.avatar}
              </span>
              <span className="text-xs font-semibold text-stone-700">{m.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
