import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { createHousehold, joinHousehold } from "../api/households";
import { ui } from "../ui";

// Модалка створення нової сім'ї або приєднання за кодом.
// Після успіху повертає створену/приєднану сім'ю через onDone.
export default function HouseholdModal({ onDone, onClose }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { data } = await createHousehold(name.trim());
      onDone(data.household);
    } catch (err) {
      setError(err.response?.data?.error || t("household.err_create"));
      setBusy(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { data } = await joinHousehold(inviteCode.trim());
      onDone(data.household);
    } catch (err) {
      setError(err.response?.data?.error || t("household.err_join"));
      setBusy(false);
    }
  }

  return (
    <div className={ui.backdrop} onClick={onClose}>
      <div className={`${ui.card} flex flex-col gap-4`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className={ui.h2}>{t("household.modal_title")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("household.close")}
            className="p-1 rounded-lg bg-transparent text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleCreate}>
          <label className={ui.label}>{t("household.create_label")}</label>
          <input
            type="text"
            placeholder={t("household.create_placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={ui.input}
          />
          <button type="submit" disabled={busy || !name.trim()} className={`${ui.btnPrimary} mt-1`}>
            {t("household.create")}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-stone-400">
          <div className="flex-1 h-px bg-stone-200" />
          <span>{t("household.or")}</span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleJoin}>
          <label className={ui.label}>{t("household.join_label")}</label>
          <input
            type="text"
            placeholder={t("household.join_placeholder")}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className={ui.input}
          />
          <button
            type="submit"
            disabled={busy || !inviteCode.trim()}
            className={`${ui.btnSecondary} mt-1`}
          >
            {t("household.join")}
          </button>
        </form>

        {error && <p className={ui.error}>{error}</p>}
      </div>
    </div>
  );
}
