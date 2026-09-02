import { useTranslation } from "react-i18next";
import { Check, RefreshCw, Clock, Trash2, Layers } from "lucide-react";
import Avatar from "./Avatar";

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

export default function TaskCard({
  task,
  onComplete,
  onConfirm,
  onOverdueClick,
  onDelete,
  groupCount = 1,
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en-US" : "uk-UA";
  const recurrenceKey = RECURRENCE_KEYS[task.recurrence];
  const isDone = task.status === "DONE";
  const isAwaiting = task.status === "AWAITING_CONFIRMATION";
  const isOverdue = task.status === "OVERDUE";
  // Кнопку «Підтвердити» бачить автор завдання; а якщо асайні немає
  // (завдання «на будь-кого») — підтвердити може будь-хто в домогосподарстві.

  const due = new Date(task.dueDate).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  function handleDelete() {
    if (window.confirm(t("task.delete_confirm", { title: task.title }))) {
      onDelete(task.id);
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl border p-4 transition-shadow hover:shadow-sm ${
        isOverdue
          ? "border-rose-200 ring-1 ring-rose-100"
          : isAwaiting
          ? "border-amber-200 ring-1 ring-amber-100"
          : "border-stone-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => !isDone && !isAwaiting && onComplete(task.id)}
          disabled={isDone || isAwaiting}
          aria-label={task.title}
          title={isAwaiting ? t("task.awaiting") : t("task.mark_done")}
          className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 border-solid flex items-center justify-center transition ${
            isDone
              ? "bg-rose-500 border-rose-500 text-white"
              : isAwaiting
              ? "bg-amber-50 border-amber-400 text-amber-600"
              : "border-stone-300 hover:border-rose-400 bg-white"
          }`}
        >
          {isDone && <Check className="w-3.5 h-3.5" />}
          {isAwaiting && <Clock className="w-3.5 h-3.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold text-stone-900 break-words ${
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
            {groupCount > 1 && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-600"
                title={t("task.occurrences", { count: groupCount })}
              >
                <Layers className="w-3 h-3" />
                {t("task.occurrences", { count: groupCount })}
              </span>
            )}
          </div>
        </div>

        {task.assignee ? (
          <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-stone-100 rounded-full pl-1 pr-2.5 py-1 max-w-[9rem]">
            <Avatar
              name={task.assignee.name}
              seed={task.assignee.id || task.assignee.name}
              src={task.assignee.avatarUrl}
              size={20}
            />
            <span className="truncate">{task.assignee.name}</span>
          </span>
        ) : (
          <span className="shrink-0 text-xs text-stone-400 bg-stone-100 rounded-full px-2.5 py-1">
            {t("task.anyone")}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between sm:justify-end gap-2">
        {isOverdue && (
          <button
            type="button"
            onClick={() => onOverdueClick(task)}
            className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full px-3 py-1.5 whitespace-nowrap"
          >
            {t("task.relay")}
          </button>
        )}

        {isAwaiting && (
          <button
            type="button"
            onClick={() => onConfirm(task.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full px-3 py-1.5 whitespace-nowrap shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            {t("task.confirm")}
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          aria-label={t("task.delete")}
          title={t("task.delete")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 rounded-full px-3 py-1.5 whitespace-nowrap"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {t("task.delete")}
        </button>
      </div>
    </div>
  );
}
