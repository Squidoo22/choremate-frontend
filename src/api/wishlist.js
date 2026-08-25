import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

// Бекенд використовує статус ACTIVE/FULFILLED, а фронт очікує PENDING/DONE (як моки).
function normalizeWish(w) {
  return { ...w, status: w.status === "FULFILLED" ? "DONE" : "PENDING" };
}

export function listWishlist(householdId) {
  if (USE_MOCKS) return mock.listWishlist(householdId);
  return client
    .get(`/households/${householdId}/wishlist`)
    .then((res) => ({ data: res.data.map(normalizeWish) }));
}

export function createWishlistItem(householdId, item) {
  if (USE_MOCKS) return mock.createWishlistItem({ householdId, ...item });
  return client
    .post(`/households/${householdId}/wishlist`, item)
    .then((res) => ({ data: normalizeWish(res.data) }));
}

export function toggleWishlistItem(id) {
  if (USE_MOCKS) return mock.toggleWishlistItem(id);
  return client.post(`/wishlist/${id}/toggle`).then((res) => ({ data: normalizeWish(res.data) }));
}
