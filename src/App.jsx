import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HouseholdProvider } from "./context/HouseholdContext";
import { RequireAuth } from "./router";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HouseholdProvider>
          <Routes>
          {/* Auth-екрани — повноекранні, без хедера/футера застосунку */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Внутрішні сторінки — в обгортці Layout */}
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <Layout>
                  <Onboarding />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Layout>
                  <Dashboard />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/statistics"
            element={
              <RequireAuth>
                <Layout>
                  <Statistics />
                </Layout>
              </RequireAuth>
            }
          />
          </Routes>
        </HouseholdProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
