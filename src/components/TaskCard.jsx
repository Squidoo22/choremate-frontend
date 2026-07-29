import { useTranslation } from "react-i18next";

const RECURRENCE_KEYS = {
  NONE: null,
  DAILY: "task.recurrence_daily",
  WEEKLY: "task.recurrence_weekly",
  MONTHLY: "task.recurrence_monthly",
};

export default function TaskCard({ task, onComplete, onOverdueClick }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en-US" : "uk-UA";
  const recurrenceKey = RECURRENCE_KEYS[task.recurrence];
  const isOverdue = task.status === "OVERDUE";

  return (
    <div className={`task-card ${isOverdue ? "task-card--overdue" : ""}`}>
      <div className="task-card__main">
        <input
          type="checkbox"
          checked={task.status === "DONE"}
          disabled={task.status === "DONE"}
          onChange={() => onComplete(task.id)}
        />
        <div>
          <p className="task-card__title">{task.title}</p>
          <p className="task-card__meta">
            {task.category} · {new Date(task.dueDate).toLocaleString(locale)}
            {recurrenceKey && <span className="badge">{t(recurrenceKey)}</span>}
            {task.assignee && <span className="badge">{task.assignee.name}</span>}
            {!task.assignee && <span className="badge">{t("task.anyone")}</span>}
          </p>
        </div>
      </div>

      {isOverdue && (
        <button className="task-card__relay-btn" onClick={() => onOverdueClick(task)}>
          {t("task.relay")}
        </button>
      )}
    </div>
  );
}
