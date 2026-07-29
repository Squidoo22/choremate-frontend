import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Захист приватних маршрутів: якщо користувач не авторизований —
// редірект на /login із запам'ятовуванням сторінки, куди він ішов,
// щоб після входу повернути його саме туди.
export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
