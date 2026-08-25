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
  listTrustDebtsFor,
  addTrustDebt,
  requestRepayTrustDebt,
  resolveTrustDebt,
  removeTrustDebt,
  listWishlistFor,
  addWishlist,
  toggleWishlist,
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

export function login({ email, password }) {
  const found = findAuthUser(email, password);
  if (!found) {
    return reject("invalid_credentials");
  }
  localStorage.setItem("householdId", household.id);
  return respond({ token: "mock-token", user: found.user });
}

export function register({ name, email, password }) {
  const user = { ...currentUser, name: name || currentUser.name, email };
  addAuthUser(email, password, user);
  return respond({ token: "mock-token", user });
}

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
  const joined = addHousehold(`Сім'я ${inviteCode || ""}`.trim(), "👋");
  return respond({ household: joined });
}

export function getHousehold(id) {
  return respond(getHouseholdById(id));
}

// Форма збігається з реальним StatisticsResponseDto (GET /statistics).
export function getStatistics(householdId) {
  const hh = getHouseholdById(householdId);
  const hhTasks = tasks.filter((t) => t.householdId === householdId);

  const completed = hhTasks.filter((t) => t.status === "DONE").length;
  const overdue = hhTasks.filter((t) => t.status === "OVERDUE").length;
  const pending = hhTasks.filter(
    (t) => t.status !== "DONE" && t.status !== "OVERDUE"
  ).length;
  const unassignedOverdue = hhTasks.filter(
    (t) => t.status === "OVERDUE" && !t.assignee
  ).length;

  const byName = {};
  hhTasks.forEach((t) => {
    const name = t.assignee?.name;
    if (!name) return;
    const e = byName[name] || (byName[name] = { assigned: 0, completed: 0, overdue: 0 });
    e.assigned += 1;
    if (t.status === "DONE") e.completed += 1;
    if (t.status === "OVERDUE") e.overdue += 1;
  });
  const totalCompleted = completed || 1;

  const members = hh.members.map((m) => {
    const e = byName[m.name] || { assigned: 0, completed: 0, overdue: 0 };
    return {
      userId: m.userId,
      name: m.name,
      completed: e.completed,
      completionShare: e.completed / totalCompleted,
      overdue: e.overdue,
      assigned: e.assigned,
      completionRate: e.assigned ? e.completed / e.assigned : 0,
      averageCompletionHours: null,
    };
  });

  return respond({
    householdId,
    totals: { tasks: hhTasks.length, completed, overdue, pending, unassignedOverdue, averageCompletionHours: null },
    members,
    generatedAt: new Date().toISOString(),
  });
}

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
    creatorId: task.creatorId || null,
    completedAt: null,
    confirmedAt: null,
  };
  setTasks([...tasks, newTask]);
  return respond(newTask);
}

// Виконавець позначає задачу виконаною: вона переходить в очікування
// підтвердження, а completedAt фіксує момент і зупиняє відлік дедлайну.
export function completeTask(taskId) {
  const completedAt = new Date().toISOString();
  const updated = tasks.map((t) =>
    t.id === taskId ? { ...t, status: "AWAITING_CONFIRMATION", completedAt } : t
  );
  setTasks(updated);
  return respond({ ok: true, task: updated.find((t) => t.id === taskId) });
}

// Автор задачі підтверджує виконання: задача стає DONE і потрапляє в історію.
export function confirmTask(taskId) {
  const confirmedAt = new Date().toISOString();
  const updated = tasks.map((t) =>
    t.id === taskId ? { ...t, status: "DONE", confirmedAt } : t
  );
  setTasks(updated);
  return respond({ ok: true, task: updated.find((t) => t.id === taskId) });
}

export function createAttentionRelay(payload) {
  return respond({ ok: true, relay: { id: nextId("relay"), ...payload } });
}

export function listTrustDebts(householdId) {
  return respond(listTrustDebtsFor(householdId));
}

export function createTrustDebt(debt) {
  return respond(addTrustDebt(debt));
}

export function redeemTrustDebt(id) {
  requestRepayTrustDebt(id);
  return respond({ ok: true });
}

export function confirmTrustDebt(id) {
  resolveTrustDebt(id);
  return respond({ ok: true });
}

export function deleteTrustDebt(id) {
  removeTrustDebt(id);
  return respond({ ok: true });
}

export function listWishlist(householdId) {
  return respond(listWishlistFor(householdId));
}

export function createWishlistItem(item) {
  return respond(addWishlist(item));
}

export function toggleWishlistItem(id) {
  toggleWishlist(id);
  return respond({ ok: true });
}
