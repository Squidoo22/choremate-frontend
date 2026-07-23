import { useState } from "react";

const CATEGORIES = ["Домашні справи", "Покупки", "Оплата рахунків", "Догляд за твариною", "Інше"];
const RECURRENCE_OPTIONS = [
  { value: "NONE", label: "Одноразово" },
  { value: "DAILY", label: "Щодня" },
  { value: "WEEKLY", label: "Щотижня" },
  { value: "MONTHLY", label: "Щомісяця" },
];

export default function TaskForm({ members, onSubmit, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
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
        <h2>Нова задача</h2>

        <input
          type="text"
          placeholder="Наприклад: винести сміття"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
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
              {r.label}
            </option>
          ))}
        </select>

        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Будь-хто</option>
          {members?.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.user?.name || m.name}
            </option>
          ))}
        </select>

        <div className="modal__actions">
          <button type="button" onClick={onClose}>
            Скасувати
          </button>
          <button type="submit">Створити</button>
        </div>
      </form>
    </div>
  );
}
