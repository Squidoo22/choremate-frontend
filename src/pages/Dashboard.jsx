import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { listTasks, createTask, completeTask, confirmTask, deleteTask, createAttentionRelay } from "../api/tasks";
import { useAuth } from "../context/AuthContext";
import { useHousehold } from "../context/HouseholdContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import AttentionRelayModal from "../components/AttentionRelayModal";
import HouseholdBar from "../components/HouseholdBar";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { householdId, household, members } = useHousehold();

  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [relayTask, setRelayTask] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(user?.id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");

  async function loadTasks() {
    if (!householdId) return;
    const res = await listTasks(householdId);
    setTasks(res.data);
  }

  useEffect(() => {
    loadTasks();
  }, [householdId]);

  async function handleCreateTask(taskData) {
    await createTask({ ...taskData, householdId, creatorId: currentUserId });
    setShowForm(false);
    loadTasks();
  }

  async function handleComplete(taskId) {
    await completeTask(taskId);
    loadTasks();
  }

  async function handleConfirm(taskId) {
    await confirmTask(taskId);
    loadTasks();
  }

  async function handleDelete(taskId) {
    await deleteTask(taskId);
    loadTasks();
  }

  async function handleRelaySubmit(payload) {
    await createAttentionRelay(payload);
    setRelayTask(null);
    loadTasks();
  }

  const currentUserId = selectedUserId ?? user?.id;
  const me = members.find((m) => m.userId === currentUserId)?.user || user;
  const partner = members.find((m) => m.userId !== currentUserId);

  const counts = {
    active: tasks.filter((x) => x.status !== "DONE").length,
    overdue: tasks.filter((x) => x.status === "OVERDUE").length,
    done: tasks.filter((x) => x.status === "DONE").length,
    all: tasks.length,
  };

  const byFilter = (x) =>
    filter === "all"
      ? true
      : filter === "active"
      ? x.status !== "DONE"
      : filter === "overdue"
      ? x.status === "OVERDUE"
      : x.status === "DONE";

  const visibleTasks = tasks
    .filter(byFilter)
    .filter((x) => x.title.toLowerCase().includes(search.trim().toLowerCase()));

  const FILTERS = [
    { key: "active", label: t("dashboard.filter_active"), count: counts.active },
    {
      key: "overdue",
      label: t("dashboard.filter_overdue"),
      count: counts.overdue,
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    { key: "done", label: t("dashboard.filter_done"), count: counts.done },
    { key: "all", label: t("dashboard.filter_all"), count: counts.all },
  ];

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-solid border-stone-200 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <HouseholdBar
            members={members}
            currentUserId={currentUserId}
            onSelectMember={setSelectedUserId}
          />
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold whitespace-nowrap">
                {t("dashboard.points", { count: me?.points ?? 0 })}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-sm font-semibold whitespace-nowrap">
                {t("dashboard.streak", { count: me?.streakCount ?? 0 })}
              </span>
            </div>
            <Link
              to="/statistics"
              className="text-sm font-semibold text-rose-600 hover:text-rose-700 no-underline"
            >
              {t("dashboard.statistics")}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard.search_placeholder")}
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-solid border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-sm shadow-sm hover:from-orange-600 hover:to-rose-600 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> {t("dashboard.add_task_short")}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-solid border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {f.icon}
              {f.label}
              <span
                className={`rounded-full px-1.5 min-w-[1.25rem] text-center ${
                  isActive ? "bg-white/20" : "bg-stone-100 text-stone-500"
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={handleComplete}
            onConfirm={handleConfirm}
            onOverdueClick={setRelayTask}
            onDelete={handleDelete}
            currentUserId={currentUserId}
          />
        ))}
        {visibleTasks.length === 0 && (
          <p className="text-center text-sm text-stone-400 py-8">
            {tasks.length === 0 ? t("dashboard.empty") : t("dashboard.empty_filtered")}
          </p>
        )}
      </div>

      {showForm && (
        <TaskForm
          members={members}
          onSubmit={handleCreateTask}
          onClose={() => setShowForm(false)}
        />
      )}

      {relayTask && (
        <AttentionRelayModal
          task={relayTask}
          partnerId={partner?.userId}
          onSubmit={handleRelaySubmit}
          onClose={() => setRelayTask(null)}
        />
      )}
    </div>
  );
}
