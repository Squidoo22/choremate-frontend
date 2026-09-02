import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

// Бекенд знає лише два стани боргу (isResolved true/false) і гасить його одразу
// через POST /debts/{id}/redeem. Проміжний стан «очікує підтвердження» (боржник
// натиснув «Погасити борг», але кредитор ще не підтвердив) бекенд не зберігає,
// тож тримаємо його на клієнті в overlay, що переживає перезавантаження сторінки.
// Обмеження: цей стан локальний для пристрою й не синхронізується між учасниками —
// поки бекенд не додасть окремий статус.
const AWAITING_KEY = "awaitingDebtIds";

function loadAwaiting() {
  try {
    return new Set(JSON.parse(localStorage.getItem(AWAITING_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

const awaiting = loadAwaiting();

function persistAwaiting() {
  localStorage.setItem(AWAITING_KEY, JSON.stringify([...awaiting]));
}

function withStatus(debt) {
  const status = debt.isResolved
    ? "RESOLVED"
    : awaiting.has(debt.id)
    ? "AWAITING_CONFIRMATION"
    : "ACTIVE";
  return { ...debt, status };
}

export function listTrustDebts(householdId) {
  if (USE_MOCKS) return mock.listTrustDebts(householdId);
  return client.get(`/households/${householdId}/debts`).then((res) => {
    // Прибираємо з overlay борги, що вже погашені на бекенді.
    let changed = false;
    for (const d of res.data) {
      if (d.isResolved && awaiting.delete(d.id)) changed = true;
    }
    if (changed) persistAwaiting();
    return { data: res.data.map(withStatus) };
  });
}

export function createTrustDebt(householdId, debt) {
  if (USE_MOCKS) return mock.createTrustDebt({ householdId, ...debt });
  return client
    .post(`/households/${householdId}/debts`, debt)
    .then((res) => ({ data: withStatus(res.data) }));
}

// Боржник натискає «Погасити борг» — локальний перехід в очікування підтвердження.
export function redeemTrustDebt(id) {
  if (USE_MOCKS) return mock.redeemTrustDebt(id);
  awaiting.add(id);
  persistAwaiting();
  return Promise.resolve({ data: { ok: true } });
}

// Кредитор підтверджує погашення — фактичне погашення боргу на бекенді.
export function confirmTrustDebt(id) {
  if (USE_MOCKS) return mock.confirmTrustDebt(id);
  return client.post(`/debts/${id}/redeem`).then((res) => {
    awaiting.delete(id);
    persistAwaiting();
    return { data: res.data };
  });
}

export function deleteTrustDebt(id) {
  if (USE_MOCKS) return mock.deleteTrustDebt(id);
  return client.delete(`/debts/${id}`).then(() => {
    awaiting.delete(id);
    persistAwaiting();
    return { data: { ok: true } };
  });
}
