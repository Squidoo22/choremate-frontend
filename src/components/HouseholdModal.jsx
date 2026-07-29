import { useState } from "react";
import { createHousehold, joinHousehold } from "../api/households";

// Модалка створення нової сім'ї або приєднання за кодом.
// Після успіху повертає створену/приєднану сім'ю через onDone.
export default function HouseholdModal({ onDone, onClose }) {
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
      setError(err.response?.data?.error || "Не вдалося створити сім'ю");
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
      setError(err.response?.data?.error || "Не вдалося приєднатися");
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal household-modal" onClick={(e) => e.stopPropagation()}>
        <div className="household-modal__head">
          <h2>Створити або приєднатися</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Закрити">
            ✕
          </button>
        </div>

        <form className="household-modal__section" onSubmit={handleCreate}>
          <label className="field-label">Створити нову сім'ю</label>
          <input
            type="text"
            placeholder="Назва (напр. «Наша квартира»)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" disabled={busy || !name.trim()}>
            Створити
          </button>
        </form>

        <div className="household-modal__divider">
          <span>або</span>
        </div>

        <form className="household-modal__section" onSubmit={handleJoin}>
          <label className="field-label">Приєднатися за кодом</label>
          <input
            type="text"
            placeholder="Інвайт-код"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          />
          <button type="submit" className="btn-secondary" disabled={busy || !inviteCode.trim()}>
            Приєднатися
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
