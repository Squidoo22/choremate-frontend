import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTasks, createTask, completeTask, createAttentionRelay } from "../api/tasks";
import { getHousehold, listHouseholds } from "../api/households";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import AttentionRelayModal from "../components/AttentionRelayModal";
import HouseholdBar from "../components/HouseholdBar";
import HouseholdModal from "../components/HouseholdModal";

export default function Dashboard() {
  const { user } = useAuth();

  const [householdId, setHouseholdId] = useState(() =>
    localStorage.getItem("householdId")
  );
  const [tasks, setTasks] = useState([]);
  const [household, setHousehold] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [relayTask, setRelayTask] = useState(null);
  const [showHouseholdModal, setShowHouseholdModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(user?.id);

  async function loadData() {
    if (!householdId) return;
    const [tasksRes, householdRes, householdsRes] = await Promise.all([
      listTasks(householdId),
      getHousehold(householdId),
      listHouseholds(),
    ]);
    setTasks(tasksRes.data);
    setHousehold(householdRes.data);
    setHouseholds(householdsRes.data);
  }

  useEffect(() => {
    loadData();
  }, [householdId]);

  function switchHousehold(id) {
    localStorage.setItem("householdId", id);
    setHouseholdId(id);
  }

  function handleHouseholdCreated(created) {
    setShowHouseholdModal(false);
    setHouseholds((prev) => [...prev, created]);
    switchHousehold(created.id);
  }

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

  const members = household?.members ?? [];
  const currentUserId = selectedUserId ?? user?.id;
  const me = members.find((m) => m.userId === currentUserId)?.user || user;
  const partner = members.find((m) => m.userId !== currentUserId);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <HouseholdBar
          household={household}
          households={households}
          members={members}
          currentUserId={currentUserId}
          onSelectHousehold={switchHousehold}
          onOpenCreate={() => setShowHouseholdModal(true)}
          onSelectMember={setSelectedUserId}
        />
        <div className="dashboard-header__widgets">
          <span className="widget">⭐ {me?.points ?? 0} балів</span>
          <span className="widget">🔥 {me?.streakCount ?? 0} днів поспіль</span>
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

      {showHouseholdModal && (
        <HouseholdModal
          onDone={handleHouseholdCreated}
          onClose={() => setShowHouseholdModal(false)}
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
