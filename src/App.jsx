import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HouseholdProvider } from "./context/HouseholdContext";
import { ToastProvider } from "./context/ToastContext";
import { RequireAuth } from "./router";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import JoinHousehold from "./pages/JoinHousehold";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import TrustDebt from "./pages/TrustDebt";
import Wishlist from "./pages/Wishlist";
import Gamification from "./pages/Gamification";

function Protected({ children, tabs = false }) {
  return (
    <RequireAuth>
      <Layout showTabs={tabs}>{children}</Layout>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <HouseholdProvider>
            <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/join/:code"
              element={
                <RequireAuth>
                  <JoinHousehold />
                </RequireAuth>
              }
            />

            <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
            <Route path="/dashboard" element={<Protected tabs><Dashboard /></Protected>} />
            <Route path="/debts" element={<Protected tabs><TrustDebt /></Protected>} />
            <Route path="/statistics" element={<Protected tabs><Statistics /></Protected>} />
            <Route path="/wishlist" element={<Protected tabs><Wishlist /></Protected>} />
            <Route path="/gamification" element={<Protected tabs><Gamification /></Protected>} />
            </Routes>
          </HouseholdProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
