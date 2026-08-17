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

export function completeTask(taskId) {
  if (USE_MOCKS) return mock.completeTask(taskId);
  return client.patch(`/tasks/${taskId}/complete`).then((res) => {
    const updated = res.data.task;
    for (const list of taskCache.values()) {
      const idx = list.findIndex((t) => t.id === updated.id);
      if (idx !== -1) list[idx] = updated;
    }
    return { data: res.data };
  });
}

// Бекенд ще не має ендпоінта attention-relay — поки що мок.
export function createAttentionRelay(payload) {
  return mock.createAttentionRelay(payload);
}
