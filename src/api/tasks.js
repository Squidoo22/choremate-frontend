import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

// Бекенд наразі не віддає список задач (є лише POST /tasks та PATCH /complete),
// тож у реальному режимі тримаємо сесійний кеш, який поповнюється створеними
// задачами. Скидається при перезавантаженні — доки бекенд не додасть GET-список.
const taskCache = new Map(); // householdId -> Task[]

function cacheFor(householdId) {
  if (!taskCache.has(householdId)) taskCache.set(householdId, []);
  return taskCache.get(householdId);
}

export function listTasks(householdId) {
  if (USE_MOCKS) return mock.listTasks(householdId);
  return Promise.resolve({ data: [...cacheFor(householdId)] });
}

export function createTask(task) {
  if (USE_MOCKS) return mock.createTask(task);
  return client.post("/tasks", task).then((res) => {
    cacheFor(res.data.householdId).push(res.data);
    return { data: res.data };
  });
}

function patchCache(taskId, patch) {
  let updated = null;
  for (const list of taskCache.values()) {
    const idx = list.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      updated = { ...list[idx], ...patch };
      list[idx] = updated;
    }
  }
  return updated;
}

// Крок 1: виконавець позначає задачу виконаною. Задача переходить в очікування
// підтвердження, а completedAt фіксує момент і зупиняє відлік дедлайну. Бекенд
// поки не має цього стану, тож у реальному режимі оновлюємо лише сесійний кеш.
export function completeTask(taskId) {
  if (USE_MOCKS) return mock.completeTask(taskId);
  const completedAt = new Date().toISOString();
  const updated = patchCache(taskId, { status: "AWAITING_CONFIRMATION", completedAt });
  return Promise.resolve({ data: { ok: true, task: updated } });
}

// Крок 2: автор задачі підтверджує виконання — задача стає DONE. Для реального
// бекенда це і є фактичний виклик PATCH /complete.
export function confirmTask(taskId) {
  if (USE_MOCKS) return mock.confirmTask(taskId);
  return client.patch(`/tasks/${taskId}/complete`).then((res) => {
    const updated = res.data.task || { id: taskId, status: "DONE" };
    patchCache(taskId, { ...updated, status: "DONE", confirmedAt: new Date().toISOString() });
    return { data: res.data };
  });
}

// Бекенд ще не має ендпоінта attention-relay — поки що мок.
export function createAttentionRelay(payload) {
  return mock.createAttentionRelay(payload);
}
