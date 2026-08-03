import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ui } from "../ui";

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

  function gestureCls(value) {
    const base =
      "rounded-xl border border-solid p-3 text-left text-sm font-medium transition cursor-pointer";
    return selected === value
      ? `${base} border-rose-500 bg-rose-50 text-rose-700`
      : `${base} border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100`;
  }

  return (
    <div className={ui.backdrop} onClick={onClose}>
      <div className={`${ui.card} flex flex-col gap-4`} onClick={(e) => e.stopPropagation()}>
        <h2 className={ui.h2}>{t("relay.title")}</h2>
        <p className="text-sm text-stone-500 leading-relaxed">
          {t("relay.description", { title: task.title })}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {GESTURE_TEMPLATES.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setSelected(g.value)}
              className={gestureCls(g.value)}
            >
              {t(g.key)}
            </button>
          ))}
          <button type="button" onClick={() => setSelected("custom")} className={gestureCls("custom")}>
            {t("relay.gesture_custom")}
          </button>
        </div>

        {selected === "custom" && (
          <input
            type="text"
            placeholder={t("relay.custom_placeholder")}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className={ui.input}
          />
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={ui.btnGhost}>
            {t("relay.cancel")}
          </button>
          <button type="button" onClick={handleSend} disabled={!selected} className={ui.btnPrimary}>
            {t("relay.send")}
          </button>
        </div>
      </div>
    </div>
  );
}
