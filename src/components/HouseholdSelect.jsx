import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, ChevronDown, Plus, Check } from "lucide-react";
import { useHousehold } from "../context/HouseholdContext";

// Селектор сім'ї для хедера: пігулка + дропдаун перемикання/створення.
export default function HouseholdSelect() {
  const { t } = useTranslation();
  const { household, households, switchHousehold, openCreate } = useHousehold();
  const [open, setOpen] = useState(false);

  if (!household) return null;

  function pick(id) {
    setOpen(false);
    switchHousehold(id);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-sm font-semibold text-stone-800 transition-colors"
      >
        <Users className="w-4 h-4 text-stone-500" />
        <span className="max-w-[10rem] truncate">
          {household.name} {household.emoji}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-solid border-stone-200 shadow-lg p-1.5 z-50">
            {households.map((h) => {
              const active = h.id === household.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => pick(h.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                    active ? "bg-rose-50 text-rose-700" : "bg-transparent text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span
                    className={`shrink-0 w-2.5 h-2.5 rounded-full border-2 border-solid ${
                      active ? "bg-rose-500 border-rose-500" : "border-stone-300"
                    }`}
                  />
                  <span className="flex-1 truncate">
                    {h.name} {h.emoji}
                  </span>
                  {active && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}

            <div className="my-1 h-px bg-stone-100" />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openCreate();
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-transparent hover:bg-rose-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("household.create_or_join_short")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
