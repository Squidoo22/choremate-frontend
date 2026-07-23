const RECURRENCE_LABELS = {
  NONE: null,
  DAILY: "щодня",
  WEEKLY: "щотижня",
  MONTHLY: "щомісяця",
};

export default function TaskCard({ task, onComplete, onOverdueClick }) {
  const recurrenceLabel = RECURRENCE_LABELS[task.recurrence];
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
            {task.category} · {new Date(task.dueDate).toLocaleString("uk-UA")}
            {recurrenceLabel && <span className="badge">{recurrenceLabel}</span>}
            {task.assignee && <span className="badge">{task.assignee.name}</span>}
            {!task.assignee && <span className="badge">будь-хто</span>}
          </p>
        </div>
      </div>

      {isOverdue && (
        <button className="task-card__relay-btn" onClick={() => onOverdueClick(task)}>
          Естафета уваги →
        </button>
      )}
    </div>
  );
}
