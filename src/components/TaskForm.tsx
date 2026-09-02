import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ui } from "../ui";

const CATEGORY_KEYS = [
  "task.cat_home",
  "task.cat_shopping",
  "task.cat_bills",
  "task.cat_pet",
  "task.cat_other",
];
const RECURRENCE_OPTIONS = [
  { value: "NONE", key: "task.rec_none" },
  { value: "DAILY", key: "task.rec_daily" },
  { value: "WEEKLY", key: "task.rec_weekly" },
  { value: "MONTHLY", key: "task.rec_monthly" },
];

export default function TaskForm({ members, onSubmit, onClose }) {
  const { t } = useTranslation();
  const categories = CATEGORY_KEYS.map((k) => t(k));
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState("NONE");
  const [assigneeId, setAssigneeId] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title,
      category,
      dueDate,
      recurrence,
      assigneeId: assigneeId || null,
    });
  }

  return (
    <div className={ui.backdrop} onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className={`${ui.card} flex flex-col gap-3`}
      >
        <h2 className={ui.h2}>{t("task.new_title")}</h2>

        <input
          type="text"
          placeholder={t("task.title_placeholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={ui.input}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className={ui.input}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className={ui.input}
        />

        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
          className={ui.input}
        >
          {RECURRENCE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {t(r.key)}
            </option>
          ))}
        </select>

        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className={ui.input}
        >
          <option value="">{t("task.anyone")}</option>
          {members?.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.user?.name || m.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 mt-1">
          <button type="button" onClick={onClose} className={ui.btnGhost}>
            {t("task.cancel")}
          </button>
          <button type="submit" className={ui.btnPrimary}>
            {t("task.create")}
          </button>
        </div>
      </form>
    </div>
  );
}
