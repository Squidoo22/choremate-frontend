import { TEST_CREDENTIALS } from "../config";

function daysFromNow(days, hour = 20) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const familyMembers = [
  { userId: "user-1", name: "Марко", avatar: "🧑‍💻", email: "marko@example.com", points: 320, streakCount: 5 },
  { userId: "user-2", name: "Софія", avatar: "👩‍🎨", email: "sofia@example.com", points: 280, streakCount: 3 },
  { userId: "user-3", name: "Денис", avatar: "🧢", email: "denys@example.com", points: 210, streakCount: 2 },
];

export const currentUser = {
  id: familyMembers[0].userId,
  name: familyMembers[0].name,
  email: familyMembers[0].email,
  avatar: familyMembers[0].avatar,
  points: familyMembers[0].points,
  streakCount: familyMembers[0].streakCount,
};

function toMembers(members) {
  return members.map((m) => ({
    userId: m.userId,
    name: m.name,
    avatar: m.avatar,
    user: { ...m, id: m.userId },
  }));
}

export let households = [
  {
    id: "hh-4",
    name: "Затишна Квартира #4",
    emoji: "🏢",
    members: toMembers(familyMembers),
  },
  {
    id: "hh-sea",
    name: "Дім на морі",
    emoji: "🏖️",
    members: toMembers([familyMembers[0], familyMembers[1]]),
  },
];

export const household = households[0];

export function getHouseholdById(id) {
  return households.find((h) => h.id === id) || households[0];
}

export function addHousehold(name, emoji = "🏠") {
  const h = {
    id: nextId("hh"),
    name: name || "Нова сім'я",
    emoji,
    members: toMembers([familyMembers[0]]),
  };
  households = [...households, h];
  return h;
}

export let tasks = [
  {
    id: "task-1",
    householdId: "hh-4",
    title: "Винести сміття",
    category: "Домашні справи",
    dueDate: daysFromNow(0, 21),
    recurrence: "DAILY",
    status: "PENDING",
    assignee: { name: "Денис" },
  },
  {
    id: "task-2",
    householdId: "hh-4",
    title: "Купити продукти на тиждень",
    category: "Покупки",
    dueDate: daysFromNow(1, 18),
    recurrence: "WEEKLY",
    status: "PENDING",
    assignee: { name: "Софія" },
  },
  {
    id: "task-3",
    householdId: "hh-4",
    title: "Оплатити комуналку",
    category: "Оплата рахунків",
    dueDate: daysFromNow(-1, 12),
    recurrence: "MONTHLY",
    status: "OVERDUE",
    assignee: null,
  },
  {
    id: "task-4",
    householdId: "hh-4",
    title: "Погодувати кота",
    category: "Догляд за твариною",
    dueDate: daysFromNow(0, 8),
    recurrence: "DAILY",
    status: "DONE",
    assignee: { name: "Марко" },
  },
  {
    id: "task-5",
    householdId: "hh-sea",
    title: "Полити квіти на терасі",
    category: "Домашні справи",
    dueDate: daysFromNow(0, 19),
    recurrence: "DAILY",
    status: "PENDING",
    assignee: { name: "Софія" },
  },
  {
    id: "task-6",
    householdId: "hh-sea",
    title: "Перевірити човен",
    category: "Інше",
    dueDate: daysFromNow(2, 11),
    recurrence: "MONTHLY",
    status: "PENDING",
    assignee: { name: "Марко" },
  },
];

export let trustDebts = [
  {
    id: "debt-1",
    householdId: "hh-4",
    debtorId: "user-3",
    creditorId: "user-1",
    taskTitle: "Оплатити комуналку",
    description: "🍳 Готує святкову романтичну вечерю",
    category: "cooking",
    createdAt: daysFromNow(-3, 9),
    isResolved: false,
  },
  {
    id: "debt-2",
    householdId: "hh-4",
    debtorId: "user-3",
    creditorId: "user-2",
    description: "☕ Робить каву в ліжко в суботу вранці",
    category: "coffee",
    createdAt: daysFromNow(-1, 14),
    isResolved: false,
  },
  {
    id: "debt-3",
    householdId: "hh-4",
    debtorId: "user-2",
    creditorId: "user-1",
    description: "🎬 Вибирає фільм на кіновечір не сперечаючись",
    category: "movie",
    createdAt: daysFromNow(-6, 20),
    resolvedAt: daysFromNow(-5, 22),
    isResolved: true,
  },
];

export function listTrustDebtsFor(householdId) {
  return trustDebts.filter((d) => d.householdId === householdId);
}

export function addTrustDebt(debt) {
  const d = {
    id: nextId("debt"),
    createdAt: new Date().toISOString(),
    isResolved: false,
    ...debt,
  };
  trustDebts = [d, ...trustDebts];
  return d;
}

export function resolveTrustDebt(id) {
  trustDebts = trustDebts.map((d) =>
    d.id === id ? { ...d, isResolved: true, resolvedAt: new Date().toISOString() } : d
  );
}

export function removeTrustDebt(id) {
  trustDebts = trustDebts.filter((d) => d.id !== id);
}

export let wishlist = [
  {
    id: "wish-1",
    householdId: "hh-4",
    title: "Романтичний пікнік у парку 🧺",
    description: "Взяти плед, фрукти, сир та лимонад",
    creatorId: "user-1",
    points: 50,
    status: "PENDING",
    createdAt: daysFromNow(-5, 18),
  },
  {
    id: "wish-2",
    householdId: "hh-4",
    title: "Настільна гра Catan 🎲",
    description: "Купити доповнення для вечорів із друзями",
    creatorId: "user-2",
    points: 20,
    status: "PENDING",
    createdAt: daysFromNow(-3, 11),
  },
  {
    id: "wish-3",
    householdId: "hh-sea",
    title: "Захід сонця на пірсі 🌅",
    description: "Взяти каву й подивитись захід разом",
    creatorId: "user-1",
    points: 30,
    status: "PENDING",
    createdAt: daysFromNow(-2, 20),
  },
];

export function listWishlistFor(householdId) {
  return wishlist.filter((w) => w.householdId === householdId);
}

export function addWishlist(item) {
  const w = {
    id: nextId("wish"),
    status: "PENDING",
    points: 20,
    createdAt: new Date().toISOString(),
    ...item,
  };
  wishlist = [w, ...wishlist];
  return w;
}

export function toggleWishlist(id) {
  wishlist = wishlist.map((w) =>
    w.id === id ? { ...w, status: w.status === "DONE" ? "PENDING" : "DONE" } : w
  );
}

export let authUsers = [
  { email: TEST_CREDENTIALS.email, password: TEST_CREDENTIALS.password, user: currentUser },
  { email: "demo@example.com", password: "demodemo", user: currentUser },
  { email: "google@example.com", password: "google", user: currentUser },
];

export function findAuthUser(email, password) {
  const e = (email || "").trim().toLowerCase();
  return authUsers.find((u) => u.email === e && u.password === password);
}

export function addAuthUser(email, password, user) {
  authUsers = [...authUsers, { email: (email || "").trim().toLowerCase(), password, user }];
}

let idCounter = tasks.length;

export function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function setTasks(next) {
  tasks = next;
}
