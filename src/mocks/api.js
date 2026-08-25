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

export function getStatistics(householdId) {
  const hh = getHouseholdById(householdId);
  const hhTasks = tasks.filter((t) => t.householdId === householdId);

  const totalDone = hhTasks.filter((t) => t.status === "DONE").length;
  const totalOverdue = hhTasks.filter((t) => t.status === "OVERDUE").length;

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
