import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

export function listTasks(householdId) {
  if (USE_MOCKS) return mock.listTasks(householdId);
  return client.get(`/households/${householdId}/tasks`);
}

export function createTask(task) {
  if (USE_MOCKS) return mock.createTask(task);
  return client.post("/tasks", task);
}

export function completeTask(taskId) {
  if (USE_MOCKS) return mock.completeTask(taskId);
  return client.patch(`/tasks/${taskId}/complete`);
}

export function createAttentionRelay(payload) {
  if (USE_MOCKS) return mock.createAttentionRelay(payload);
  return client.post("/attention-relay", payload);
}
