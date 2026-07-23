import client from "./client";

export function listTasks(householdId) {
  return client.get(`/households/${householdId}/tasks`);
}

export function createTask(task) {
  return client.post("/tasks", task);
}

export function completeTask(taskId) {
  return client.patch(`/tasks/${taskId}/complete`);
}

export function createAttentionRelay(payload) {
  return client.post("/attention-relay", payload);
}
