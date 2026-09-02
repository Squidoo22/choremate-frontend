// Доменні типи ChoreMate. Форми даних узгоджені з відповідями бекенду після
// нормалізації в шарі api/* (див. коментарі в api/households.ts, api/tasks.ts тощо).

export type ID = string;

// --- Користувачі та учасники ---

export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  avatarUrl?: string | null;
  points?: number;
  streakCount?: number;
}

// Учасник спільного простору: плоскі поля з бекенду + вкладений user (нормалізація).
export interface Member {
  userId: ID;
  name?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string | null;
  points?: number;
  streakCount?: number;
  user: User;
}

// --- Спільні простори ---

export interface Household {
  id: ID;
  name: string;
  emoji?: string;
  inviteCode?: string;
  inviteLink?: string;
  members: Member[];
}

// --- Завдання ---

export type TaskStatus =
  | "PENDING"
  | "OVERDUE"
  | "AWAITING_CONFIRMATION"
  | "DONE";

export type Recurrence = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface Task {
  id: ID;
  householdId: ID;
  title: string;
  category?: string;
  dueDate?: string;
  recurrence?: Recurrence;
  status: TaskStatus;
  assignee?: { name: string } | null;
  assigneeId?: ID | null;
  creatorId?: ID;
  completedAt?: string | null;
  confirmedAt?: string | null;
}

// Поля, які приймає форма створення задачі (частина зберігається в overlay).
export interface CreateTaskInput {
  title: string;
  category?: string;
  dueDate?: string;
  recurrence?: Recurrence;
  assigneeId?: ID | null;
  householdId: ID;
  creatorId?: ID;
}

// --- Борг довіри ---

export type TrustDebtStatus = "ACTIVE" | "AWAITING_CONFIRMATION" | "RESOLVED";

export interface TrustDebt {
  id: ID;
  householdId: ID;
  debtorId: ID;
  creditorId: ID;
  taskTitle?: string;
  description?: string;
  category?: string;
  status: TrustDebtStatus;
  isResolved: boolean;
  createdAt?: string;
  requestedAt?: string;
  resolvedAt?: string;
}

// --- Список бажань ---

export type WishStatus = "PENDING" | "DONE";

export interface WishlistItem {
  id: ID;
  householdId: ID;
  title: string;
  description?: string;
  creatorId?: ID;
  points?: number;
  status: WishStatus;
  createdAt?: string;
}

// --- Автентифікація ---

// Форма, до якої шар api приводить AuthResponseDto бекенду.
export interface AuthResult {
  token: string;
  refreshToken?: string;
  user: User;
}

// --- Асистент ---

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export interface AssistantReply {
  text: string;
}

// --- Тости ---

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Зручна обгортка для функцій api, що повертають axios-подібний { data }.
export interface DataResponse<T> {
  data: T;
}
