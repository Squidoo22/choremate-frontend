import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTasks, createTask, completeTask, createAttentionRelay } from "../api/tasks";
import { getHousehold } from "../api/households";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import AttentionRelayModal from "../components/AttentionRelayModal";

export default function Dashboard() {
  const { user } = useAuth();
  const householdId = localStorage.getItem("householdId");

  const [tasks, setTasks] = useState([]);
  const [household, setHousehold] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [relayTask, setRelayTask] = useState(null);

  async function loadData() {
    if (!householdId) return;
    const [tasksRes, householdRes] = await Promise.all([
      listTasks(householdId),
      getHousehold(householdId),
    ]);
    setTasks(tasksRes.data);
    setHousehold(householdRes.data);
  }

  useEffect(() => {
    loadData();
  }, [householdId]);

  async function handleCreateTask(taskData) {
    await createTask({ ...taskData, householdId });
    setShowForm(false);
    loadData();
  }

  async function handleComplete(taskId) {
    await completeTask(taskId);
    loadData();
  }

  async function handleRelaySubmit(payload) {
    await createAttentionRelay(payload);
    setRelayTask(null);
    loadData();
  }

  const partner = household?.members?.find((m) => m.userId !== user?.id);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>{household?.name || "Наш простір"}</h1>
        <div className="dashboard-header__widgets">
          <span className="widget">⭐ {user?.points ?? 0} балів</span>
          <span className="widget">🔥 {user?.streakCount ?? 0} днів поспіль</span>
        </div>
        <Link to="/statistics">Статистика →</Link>
      </header>

      <button className="add-task-btn" onClick={() => setShowForm(true)}>
        + Нова задача
      </button>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={handleComplete}
            onOverdueClick={setRelayTask}
          />
        ))}
        {tasks.length === 0 && <p>Задач поки немає — додайте першу!</p>}
      </div>

      {showForm && (
        <TaskForm
          members={household?.members}
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
