// Мокові реалізації API-функцій.
// Повертають той самий формат, що й axios ({ data }), із невеликою
// затримкою — щоб імітувати мережу. Коли з'явиться реальний бекенд,
// достатньо вимкнути VITE_USE_MOCKS, ці функції не викликатимуться.
import {
  currentUser,
  household,
  households,
  getHouseholdById,
  addHousehold,
  findAuthUser,
  addAuthUser,
  tasks,
  nextId,
  setTasks,
} from "./db";

const LATENCY = 300;

function respond(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), LATENCY);
  });
}

function reject(error) {
  return new Promise((_, rej) => {
    setTimeout(() => rej({ response: { data: { error } } }), LATENCY);
  });
}

// --- auth ---
export function login({ email, password }) {
  // Справжня перевірка: email + пароль мають збігтися з відомим акаунтом.
  const found = findAuthUser(email, password);
  if (!found) {
    return reject("invalid_credentials");
  }
  // Прив'язуємо до готового простору, щоб дашборд мав дані одразу.
  localStorage.setItem("householdId", household.id);
  return respond({ token: "mock-token", user: found.user });
}

export function register({ name, email, password }) {
  const user = { ...currentUser, name: name || currentUser.name, email };
  // Додаємо акаунт, щоб потім можна було увійти цими ж даними.
  addAuthUser(email, password, user);
  return respond({ token: "mock-token", user });
}

// --- households ---
export function listHouseholds() {
  return respond([...households]);
}

export function createHousehold(name) {
  const created = addHousehold(name);
  return respond({
    household: created,
    inviteLink: `https://choremate.app/join/${created.id.toUpperCase()}`,
  });
}

export function joinHousehold(inviteCode) {
  // Мок: «приєднання» просто створює сім'ю з назвою за кодом.
  const joined = addHousehold(`Сім'я ${inviteCode || ""}`.trim(), "👋");
  return respond({ household: joined });
}

export function getHousehold(id) {
  return respond(getHouseholdById(id));
}

export function getStatistics(householdId) {
  const hh = getHouseholdById(householdId);
  const hhTasks = tasks.filter((t) => t.householdId === householdId);

  const totalDone = hhTasks.filter((t) => t.status === "DONE").length;
  const totalOverdue = hhTasks.filter((t) => t.status === "OVERDUE").length;

  // Навантаження = частка призначених задач на кожного учасника.
  const assignedByName = {};
  const doneByName = {};
  hhTasks.forEach((t) => {
    const name = t.assignee?.name;
    if (!name) return;
    assignedByName[name] = (assignedByName[name] || 0) + 1;
    if (t.status === "DONE") doneByName[name] = (doneByName[name] || 0) + 1;
  });
  const totalAssigned = Object.values(assignedByName).reduce((a, b) => a + b, 0);

  const perMember = hh.members.map((m) => ({
    userId: m.userId,
    name: m.name,
    sharePercent: totalAssigned
      ? Math.round(((assignedByName[m.name] || 0) / totalAssigned) * 100)
      : 0,
  }));

  const mostActive =
    Object.entries(doneByName).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return respond({ perMember, totalDone, totalOverdue, mostActive });
}

// --- tasks ---
export function listTasks(householdId) {
  return respond(tasks.filter((t) => t.householdId === householdId));
}

export function createTask(task) {
  const activeHousehold = getHouseholdById(task.householdId);
  const assigneeName = activeHousehold.members.find(
    (m) => m.userId === task.assigneeId
  )?.name;
  const newTask = {
    id: nextId("task"),
    householdId: task.householdId,
    title: task.title,
    category: task.category,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : new Date().toISOString(),
    recurrence: task.recurrence || "NONE",
    status: "PENDING",
    assignee: assigneeName ? { name: assigneeName } : null,
  };
  setTasks([...tasks, newTask]);
  return respond(newTask);
}

export function completeTask(taskId) {
  setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: "DONE" } : t)));
  return respond({ ok: true });
}

export function createAttentionRelay(payload) {
  return respond({ ok: true, relay: { id: nextId("relay"), ...payload } });
}
