import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import type { Toast, ToastType } from "../types";

interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => number;
  success: (message: string, duration?: number) => number;
  error: (message: string, duration?: number) => number;
  info: (message: string, duration?: number) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };

const STYLES = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  error: "bg-rose-50 border-rose-200 text-rose-900",
  info: "bg-white border-stone-200 text-stone-800",
};

const ICON_COLORS = {
  success: "text-emerald-600",
  error: "text-rose-600",
  info: "text-stone-500",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, type: ToastType = "info", duration = 3500) => {
      const id = (idRef.current += 1);
      setToasts((list) => [...list, { id, message, type }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      show: push,
      success: (message, duration) => push(message, "success", duration),
      error: (message, duration) => push(message, "error", duration),
      info: (message, duration) => push(message, "info", duration),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Фіксований стек тостів — над таб-баром на мобілці й над плаваючим помічником */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-28 sm:bottom-6 z-[60] flex flex-col items-center gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className={`pointer-events-auto w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-lg animate-fade-in ${STYLES[toast.type]}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${ICON_COLORS[toast.type]}`} />
              <span className="text-sm font-medium flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label={t("household.close")}
                className="shrink-0 p-0.5 rounded-lg bg-transparent opacity-60 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast має використовуватись всередині ToastProvider");
  return ctx;
}
