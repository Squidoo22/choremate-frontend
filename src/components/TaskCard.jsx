import { useTranslation } from "react-i18next";
import { Check, RefreshCw } from "lucide-react";

const RECURRENCE_KEYS = {
  NONE: null,
  DAILY: "task.recurrence_daily",
  WEEKLY: "task.recurrence_weekly",
  MONTHLY: "task.recurrence_monthly",
};

const CAT_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
];

function catColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return CAT_COLORS[h % CAT_COLORS.length];
}

export default function TaskCard({ task, onComplete, onOverdueClick }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en-US" : "uk-UA";
  const recurrenceKey = RECURRENCE_KEYS[task.recurrence];
  const isDone = task.status === "DONE";
  const isOverdue = task.status === "OVERDUE";

  const due = new Date(task.dueDate).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`bg-white rounded-2xl border p-4 flex items-center gap-3 transition-shadow hover:shadow-sm ${
        isOverdue ? "border-rose-200 ring-1 ring-rose-100" : "border-stone-200"
      }`}
    >
      <button
        type="button"
        onClick={() => !isDone && onComplete(task.id)}
        disabled={isDone}
        aria-label={task.title}
        className={`shrink-0 w-6 h-6 rounded-full border-2 border-solid flex items-center justify-center transition ${
          isDone
            ? "bg-rose-500 border-rose-500 text-white"
            : "border-stone-300 hover:border-rose-400 bg-white"
        }`}
      >
        {isDone && <Check className="w-3.5 h-3.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`font-semibold text-stone-900 truncate ${
            isDone ? "line-through text-stone-400" : ""
          }`}
        >
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
          <span className={`px-2 py-0.5 rounded-full font-medium ${catColor(task.category)}`}>
            {task.category}
          </span>
          <span>{due}</span>
          {recurrenceKey && (
            <span className="inline-flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              {t(recurrenceKey)}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {task.assignee ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-stone-100 rounded-full pl-1 pr-2.5 py-1">
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[11px] font-bold text-stone-500">
              {task.assignee.name.charAt(0)}
            </span>
            {task.assignee.name}
          </span>
        ) : (
          <span className="text-xs text-stone-400 bg-stone-100 rounded-full px-2.5 py-1">
            {t("task.anyone")}
          </span>
        )}

        {isOverdue && (
          <button
            type="button"
            onClick={() => onOverdueClick(task)}
            className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full px-3 py-1.5 whitespace-nowrap"
          >
            {t("task.relay")}
          </button>
        )}
      </div>
    </div>
  );
}
