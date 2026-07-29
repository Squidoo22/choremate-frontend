import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

export function listHouseholds() {
  if (USE_MOCKS) return mock.listHouseholds();
  return client.get("/households");
}

export function createHousehold(name) {
  if (USE_MOCKS) return mock.createHousehold(name);
  return client.post("/households", { name });
}

export function joinHousehold(inviteCode) {
  if (USE_MOCKS) return mock.joinHousehold(inviteCode);
  return client.post("/households/join", { inviteCode });
}

export function getHousehold(id) {
  if (USE_MOCKS) return mock.getHousehold(id);
  return client.get(`/households/${id}`);
}

export function getStatistics(householdId) {
  if (USE_MOCKS) return mock.getStatistics(householdId);
  return client.get(`/households/${householdId}/statistics`);
}
