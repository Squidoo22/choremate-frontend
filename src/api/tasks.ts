import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

// Бекенд знає лише статуси PENDING/DONE/OVERDUE і не має поля «автор задачі».
// Стан «очікує підтвердження» (виконавець позначив виконаним, автор ще не
// підтвердив), момент виконання (completedAt) та creatorId для гейтингу кнопки
// «Підтвердити» тримаємо в клієнтському overlay, що переживає перезавантаження.
// Обмеження: overlay локальний для пристрою й не синхронізується між учасниками —
// creatorId відомий лише для задач, створених на цьому пристрої.
const OVERLAY_KEY = "taskOverlay";

function loadOverlay() {
  try {
    return JSON.parse(localStorage.getItem(OVERLAY_KEY) || "{}");
  } catch {
    return {};
  }
}

const overlay = loadOverlay(); // { [taskId]: { status?, completedAt?, creatorId? } }

function persistOverlay() {
  localStorage.setItem(OVERLAY_KEY, JSON.stringify(overlay));
}

function setOverlay(id, patch) {
  overlay[id] = { ...overlay[id], ...patch };
  persistOverlay();
}

function applyOverlay(task) {
  const o = overlay[task.id];
  if (!o) return task;
  const merged = { ...task };
  if (o.creatorId) merged.creatorId = o.creatorId;
  // Локально позначено виконаним, а бекенд ще не DONE → показуємо очікування.
  if (o.status === "AWAITING_CONFIRMATION" && task.status !== "DONE") {
    merged.status = "AWAITING_CONFIRMATION";
    merged.completedAt = o.completedAt;
  }
  return merged;
}

export function listTasks(householdId) {
  if (USE_MOCKS) return mock.listTasks(householdId);
  return client
    .get("/tasks", { params: { householdId, limit: 100 } })
    .then((res) => {
      const items = res.data.items || [];
      // Прибираємо застарілий локальний стан очікування для задач, що вже DONE.
      let changed = false;
      for (const it of items) {
        const o = overlay[it.id];
        if (o?.status === "AWAITING_CONFIRMATION" && it.status === "DONE") {
          delete o.status;
          delete o.completedAt;
          changed = true;
        }
      }
      if (changed) persistOverlay();
      return { data: items.map(applyOverlay) };
    });
}

export function createTask(task) {
  if (USE_MOCKS) return mock.createTask(task);
  // Бекенд приймає лише ці поля (CreateTaskDto); creatorId зберігаємо локально.
  const body = {
    title: task.title,
    category: task.category,
    dueDate: task.dueDate,
    recurrence: task.recurrence || "NONE",
    assigneeId: task.assigneeId ?? null,
    householdId: task.householdId,
  };
  return client.post("/tasks", body).then((res) => {
    if (task.creatorId) setOverlay(res.data.id, { creatorId: task.creatorId });
    return { data: applyOverlay(res.data) };
  });
}

// Крок 1: виконавець позначає задачу виконаною. Локальний перехід в очікування
// підтвердження — completedAt фіксує момент і зупиняє відлік дедлайну.
export function completeTask(taskId) {
  if (USE_MOCKS) return mock.completeTask(taskId);
  setOverlay(taskId, {
    status: "AWAITING_CONFIRMATION",
    completedAt: new Date().toISOString(),
  });
  return Promise.resolve({ data: { ok: true } });
}

// Крок 2: автор задачі підтверджує виконання — фактичне завершення на бекенді.
export function confirmTask(taskId) {
  if (USE_MOCKS) return mock.confirmTask(taskId);
  return client.patch(`/tasks/${taskId}/complete`).then((res) => {
    const o = overlay[taskId];
    if (o) {
      delete o.status;
      delete o.completedAt;
      persistOverlay();
    }
    return { data: res.data };
  });
}

// Повне видалення задачі на бекенді (DELETE /tasks/{id}); чистимо й локальний overlay.
export function deleteTask(taskId) {
  if (USE_MOCKS) return mock.deleteTask(taskId);
  return client.delete(`/tasks/${taskId}`).then((res) => {
    if (overlay[taskId]) {
      delete overlay[taskId];
      persistOverlay();
    }
    return { data: res.data };
  });
}

export function createAttentionRelay(payload) {
  if (USE_MOCKS) return mock.createAttentionRelay(payload);
  return client.post("/attention-relay", payload).then((res) => ({ data: res.data }));
}
