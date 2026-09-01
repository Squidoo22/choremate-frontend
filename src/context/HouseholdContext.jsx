import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getHousehold, listHouseholds } from "../api/households";
import { useAuth } from "./AuthContext";
import HouseholdModal from "../components/HouseholdModal";

const HouseholdContext = createContext(null);

export function HouseholdProvider({ children }) {
  const { user } = useAuth();
  const [householdId, setHouseholdId] = useState(() => localStorage.getItem("householdId"));
  const [households, setHouseholds] = useState([]);
  const [household, setHousehold] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (user) {
      setHouseholdId(localStorage.getItem("householdId"));
    } else {
      setHouseholdId(null);
      setHousehold(null);
      setHouseholds([]);
    }
  }, [user]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const listRes = await listHouseholds();
      const list = listRes.data || [];
      setHouseholds(list);

      // Обираємо активний простір: збережений (якщо він ще у списку) або перший
      // доступний. Це відновлює вибір після входу, коли householdId скинуто на виході.
      const id =
        householdId && list.some((h) => h.id === householdId)
          ? householdId
          : list[0]?.id ?? null;

      if (id && id !== householdId) {
        localStorage.setItem("householdId", id);
        setHouseholdId(id);
      }

      if (id) {
        const hhRes = await getHousehold(id);
        setHousehold(hhRes.data);
      } else {
        setHousehold(null);
      }
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error("[HouseholdContext] load failed:", err);
      }
    }
  }, [user, householdId]);

  useEffect(() => {
    load();
  }, [load]);

  const switchHousehold = useCallback((id) => {
    localStorage.setItem("householdId", id);
    setHouseholdId(id);
  }, []);

  function handleCreated(created) {
    setShowCreate(false);
    setHouseholds((prev) => [...prev, created]);
    switchHousehold(created.id);
  }

  const value = {
    householdId,
    households,
    household,
    members: household?.members ?? [],
    switchHousehold,
    openCreate: () => setShowCreate(true),
    reload: load,
  };

  return (
    <HouseholdContext.Provider value={value}>
      {children}
      {showCreate && (
        <HouseholdModal onDone={handleCreated} onClose={() => setShowCreate(false)} />
      )}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const ctx = useContext(HouseholdContext);
  if (!ctx) throw new Error("useHousehold має використовуватись всередині HouseholdProvider");
  return ctx;
}
