// In-memory сховище мокових даних.
// Живе на час сесії (до перезавантаження сторінки) і мутується
// моковими API-функціями, щоб UI поводився як з реальним бекендом.
import { TEST_CREDENTIALS } from "../config";

function daysFromNow(days, hour = 20) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

// Учасники сім'ї (як у дизайні): аватар-емодзі, бали, серія днів.
export const familyMembers = [
  { userId: "user-1", name: "Марко", avatar: "🧑‍💻", email: "marko@example.com", points: 320, streakCount: 5 },
  { userId: "user-2", name: "Софія", avatar: "👩‍🎨", email: "sofia@example.com", points: 280, streakCount: 3 },
  { userId: "user-3", name: "Денис", avatar: "🧢", email: "denys@example.com", points: 210, streakCount: 2 },
];

// «Ви» за замовчуванням — перший учасник.
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

// Сім'ї, до яких належить користувач (для дропдауна-перемикача).
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

// Активна сім'я за замовчуванням — перша.
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
  // --- Затишна Квартира #4 (hh-4) ---
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
  // --- Дім на морі (hh-sea) ---
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

// Акаунти, з якими можна увійти (email + пароль).
// Сюди входить тестовий акаунт, демо та Google-вхід; реєстрація додає нові.
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
