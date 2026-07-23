import { useState } from "react";

const GESTURE_TEMPLATES = [
  { value: "coffee", label: "☕ Приготувати каву" },
  { value: "dinner", label: "🍽️ Приготувати вечерю" },
  { value: "movie_choice", label: "🎬 Вибрати фільм партнеру" },
  { value: "next_chore", label: "🧹 Взяти на себе наступну справу" },
];

export default function AttentionRelayModal({ task, partnerId, onSubmit, onClose }) {
  const [selected, setSelected] = useState(null);
  const [customText, setCustomText] = useState("");

  function handleSend() {
    if (!selected) return;
    onSubmit({
      taskId: task.id,
      toUserId: partnerId,
      gestureType: selected,
      customText: selected === "custom" ? customText : null,
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="modal attention-relay-modal">
        <h2>Естафета уваги</h2>
        <p>
          Задачу «{task.title}» не виконано вчасно. Оберіть приємний жест для партнера замість
          цього — без негативу, просто компенсація 🙂
        </p>

        <div className="gesture-grid">
          {GESTURE_TEMPLATES.map((g) => (
            <button
              key={g.value}
              className={`gesture-card ${selected === g.value ? "gesture-card--selected" : ""}`}
              onClick={() => setSelected(g.value)}
              type="button"
            >
              {g.label}
            </button>
          ))}
          <button
            className={`gesture-card ${selected === "custom" ? "gesture-card--selected" : ""}`}
            onClick={() => setSelected("custom")}
            type="button"
          >
            ✏️ Своя ідея
          </button>
        </div>

        {selected === "custom" && (
          <input
            type="text"
            placeholder="Опишіть свою ідею"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
          />
        )}

        <div className="modal__actions">
          <button type="button" onClick={onClose}>
            Скасувати
          </button>
          <button type="button" onClick={handleSend} disabled={!selected}>
            Надіслати
          </button>
        </div>
      </div>
    </div>
  );
}
