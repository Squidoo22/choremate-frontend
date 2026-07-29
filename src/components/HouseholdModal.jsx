import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createHousehold, joinHousehold } from "../api/households";

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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal household-modal" onClick={(e) => e.stopPropagation()}>
        <div className="household-modal__head">
          <h2>{t("household.modal_title")}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t("household.close")}>
            ✕
          </button>
        </div>

        <form className="household-modal__section" onSubmit={handleCreate}>
          <label className="field-label">{t("household.create_label")}</label>
          <input
            type="text"
            placeholder={t("household.create_placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" disabled={busy || !name.trim()}>
            {t("household.create")}
          </button>
        </form>

        <div className="household-modal__divider">
          <span>{t("household.or")}</span>
        </div>

        <form className="household-modal__section" onSubmit={handleJoin}>
          <label className="field-label">{t("household.join_label")}</label>
          <input
            type="text"
            placeholder={t("household.join_placeholder")}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          />
          <button type="submit" className="btn-secondary" disabled={busy || !inviteCode.trim()}>
            {t("household.join")}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
