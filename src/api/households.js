import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

export function listHouseholds() {
  if (USE_MOCKS) return mock.listHouseholds();
  return client.get("/households");
}

// Бекенд повертає HouseholdResponseDto напряму; фронт очікує {household, inviteLink}.
export function createHousehold(name) {
  if (USE_MOCKS) return mock.createHousehold(name);
  return client
    .post("/households", { name })
    .then((res) => ({ data: { household: res.data, inviteLink: res.data.inviteLink } }));
}

export function joinHousehold(inviteCode) {
  if (USE_MOCKS) return mock.joinHousehold(inviteCode);
  return client
    .post("/households/join", { inviteCode })
    .then((res) => ({ data: { household: res.data } }));
}

export function getHousehold(id) {
  if (USE_MOCKS) return mock.getHousehold(id);
  return client.get(`/households/${id}`);
}

// Бекенд ще не має ендпоінта статистики — поки що рахуємо на моку.
export function getStatistics(householdId) {
  return mock.getStatistics(householdId);
}
