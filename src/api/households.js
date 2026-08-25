import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

// Бекенд повертає учасника плоско (points/streakCount/avatarUrl на верхньому рівні),
// а фронт очікує їх ще й у вкладеному member.user (як у моках). Додаємо .user,
// зберігаючи плоскі поля — так сторінки «Дашборд» і «Гейміфікація» читають бали
// та серію (streakCount) без правок кожного компонента.
function normalizeHousehold(hh) {
  if (!hh || !Array.isArray(hh.members)) return hh;
  return {
    ...hh,
    members: hh.members.map((m) => ({
      ...m,
      user: m.user || {
        id: m.userId,
        name: m.name,
        email: m.email,
        avatarUrl: m.avatarUrl ?? null,
        points: m.points ?? 0,
        streakCount: m.streakCount ?? 0,
      },
    })),
  };
}

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
  return client.get(`/households/${id}`).then((res) => ({ data: normalizeHousehold(res.data) }));
}

export function getStatistics(householdId) {
  if (USE_MOCKS) return mock.getStatistics(householdId);
  return client.get("/statistics", { params: { householdId } });
}
