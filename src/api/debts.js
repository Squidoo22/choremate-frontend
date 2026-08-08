import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

export function listTrustDebts(householdId) {
  if (USE_MOCKS) return mock.listTrustDebts(householdId);
  return client.get(`/households/${householdId}/debts`);
}

export function createTrustDebt(householdId, debt) {
  if (USE_MOCKS) return mock.createTrustDebt({ householdId, ...debt });
  return client.post(`/households/${householdId}/debts`, debt);
}

export function redeemTrustDebt(id) {
  if (USE_MOCKS) return mock.redeemTrustDebt(id);
  return client.post(`/debts/${id}/redeem`);
}

export function deleteTrustDebt(id) {
  if (USE_MOCKS) return mock.deleteTrustDebt(id);
  return client.delete(`/debts/${id}`);
}
