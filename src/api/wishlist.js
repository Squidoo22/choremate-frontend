import * as mock from "../mocks/api";

// Бекенд ще не має ендпоінтів wishlist — усі виклики поки що йдуть у мок.
export function listWishlist(householdId) {
  return mock.listWishlist(householdId);
}

export function createWishlistItem(householdId, item) {
  return mock.createWishlistItem({ householdId, ...item });
}

export function toggleWishlistItem(id) {
  return mock.toggleWishlistItem(id);
}
