import { useState } from "react";
import { useTranslation } from "react-i18next";

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
    <div className="modal-backdrop">
      <form className="modal task-form" onSubmit={handleSubmit}>
        <h2>{t("task.new_title")}</h2>

        <input
          type="text"
          placeholder={t("task.title_placeholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        />

        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
          {RECURRENCE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {t(r.key)}
            </option>
          ))}
        </select>

        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">{t("task.anyone")}</option>
          {members?.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.user?.name || m.name}
            </option>
          ))}
        </select>

        <div className="modal__actions">
          <button type="button" onClick={onClose}>
            {t("task.cancel")}
          </button>
          <button type="submit">{t("task.create")}</button>
        </div>
      </form>
    </div>
  );
}
