import * as mock from "../mocks/api";

// Бекенд ще не має ендпоінтів "боргів довіри" — усі виклики поки що йдуть у мок.
export function listTrustDebts(householdId) {
  return mock.listTrustDebts(householdId);
}

export function createTrustDebt(householdId, debt) {
  return mock.createTrustDebt({ householdId, ...debt });
}

export function redeemTrustDebt(id) {
  return mock.redeemTrustDebt(id);
}

export function deleteTrustDebt(id) {
  return mock.deleteTrustDebt(id);
}
