import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useHousehold } from "./context/HouseholdContext";

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export function RequireHousehold({ children }) {
  const { households, loaded } = useHousehold();

  if (!loaded) return null;

  if (households.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}
