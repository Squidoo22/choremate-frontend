import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext";

/**
 * Слухає подію `auth:logout` (кидає api/client при 401 без можливості рефрешу)
 * і показує тост про завершення сесії. Має рендеритись усередині ToastProvider.
 */
export default function SessionExpiryToast() {
  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const onLogout = (event) => {
      if (event.detail?.reason === "session_expired") {
        toast.error(t("toast.session_expired"));
      }
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [toast, t]);

  return null;
}
