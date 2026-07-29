import { useState } from "react";
import { useTranslation } from "react-i18next";

const GESTURE_TEMPLATES = [
  { value: "coffee", key: "relay.gesture_coffee" },
  { value: "dinner", key: "relay.gesture_dinner" },
  { value: "movie_choice", key: "relay.gesture_movie" },
  { value: "next_chore", key: "relay.gesture_chore" },
];

export default function AttentionRelayModal({ task, partnerId, onSubmit, onClose }) {
  const { t } = useTranslation();
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
        <h2>{t("relay.title")}</h2>
        <p>{t("relay.description", { title: task.title })}</p>

        <div className="gesture-grid">
          {GESTURE_TEMPLATES.map((g) => (
            <button
              key={g.value}
              className={`gesture-card ${selected === g.value ? "gesture-card--selected" : ""}`}
              onClick={() => setSelected(g.value)}
              type="button"
            >
              {t(g.key)}
            </button>
          ))}
          <button
            className={`gesture-card ${selected === "custom" ? "gesture-card--selected" : ""}`}
            onClick={() => setSelected("custom")}
            type="button"
          >
            {t("relay.gesture_custom")}
          </button>
        </div>

        {selected === "custom" && (
          <input
            type="text"
            placeholder={t("relay.custom_placeholder")}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
          />
        )}

        <div className="modal__actions">
          <button type="button" onClick={onClose}>
            {t("relay.cancel")}
          </button>
          <button type="button" onClick={handleSend} disabled={!selected}>
            {t("relay.send")}
          </button>
        </div>
      </div>
    </div>
  );
}
