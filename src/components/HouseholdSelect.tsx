import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, ChevronDown, Plus, Check, Copy, Share2 } from "lucide-react";
import { useHousehold } from "../context/HouseholdContext";

export default function HouseholdSelect() {
  const { t } = useTranslation();
  const { household, households, switchHousehold, openCreate } = useHousehold();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!household) return null;

  // Реальний бекенд віддає inviteLink/inviteCode у household; для запасного
  // варіанту будуємо посилання з коду.
  const inviteCode = household.inviteCode;
  const inviteLink =
    household.inviteLink ||
    (inviteCode ? `${window.location.origin}/join/${inviteCode}` : null);

  function pick(id) {
    setOpen(false);
    switchHousehold(id);
  }

  async function copyLink() {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      // Запасний варіант, якщо Clipboard API недоступний (нема user-activation/дозволу).
      const ta = document.createElement("textarea");
      ta.value = inviteLink;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* нічого не вдіємо */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareLink() {
    if (!inviteLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: household.name,
          text: t("household.share_text"),
          url: inviteLink,
        });
      } catch {
        /* користувач скасував шеринг */
      }
    } else {
      copyLink();
    }
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

            {inviteLink && (
              <>
                <div className="my-1 h-px bg-stone-100" />
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-stone-700">
                    {t("household.invite_title")}
                  </p>
                  <p className="text-[11px] text-stone-400 mb-2">
                    {t("household.invite_hint")}
                  </p>
                  {inviteCode && (
                    <div className="mb-2 text-center py-1.5 rounded-lg bg-stone-50 border border-solid border-stone-200 font-mono text-sm font-bold tracking-widest text-stone-800">
                      {inviteCode}
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={copyLink}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? t("household.copied") : t("household.copy_link")}
                    </button>
                    <button
                      type="button"
                      onClick={shareLink}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {t("household.share")}
                    </button>
                  </div>
                </div>
              </>
            )}

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
