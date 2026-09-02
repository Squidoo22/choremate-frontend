import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { logout as apiLogout } from "../api/auth";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loginUser: (token: string, userData: User) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const loginUser = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logoutUser = useCallback(() => {
    apiLogout(); // анулюємо refresh-токен на бекенді (best-effort)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // Клієнт кидає цю подію, коли рефреш токена не вдався — примусово розлогінюємось.
  useEffect(() => {
    const onForcedLogout = () => setUser(null);
    window.addEventListener("auth:logout", onForcedLogout);
    return () => window.removeEventListener("auth:logout", onForcedLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth має використовуватись всередині AuthProvider");
  return ctx;
}
