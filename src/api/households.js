import client from "./client";

export function createHousehold(name) {
  return client.post("/households", { name });
}

export function joinHousehold(inviteCode) {
  return client.post("/households/join", { inviteCode });
}

export function getHousehold(id) {
  return client.get(`/households/${id}`);
}

export function getStatistics(householdId) {
  return client.get(`/households/${householdId}/statistics`);
}
