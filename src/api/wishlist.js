import client from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/api";

export function listWishlist(householdId) {
  if (USE_MOCKS) return mock.listWishlist(householdId);
  return client.get(`/households/${householdId}/wishlist`);
}

export function createWishlistItem(householdId, item) {
  if (USE_MOCKS) return mock.createWishlistItem({ householdId, ...item });
  return client.post(`/households/${householdId}/wishlist`, item);
}

export function toggleWishlistItem(id) {
  if (USE_MOCKS) return mock.toggleWishlistItem(id);
  return client.post(`/wishlist/${id}/toggle`);
}
