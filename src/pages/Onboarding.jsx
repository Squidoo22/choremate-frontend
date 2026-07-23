import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHousehold, joinHousehold } from "../api/households";
import InviteCodeBox from "../components/InviteCodeBox";

export default function Onboarding() {
  const [mode, setMode] = useState(null); // "create" | "join"
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteLink, setInviteLink] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await createHousehold(name);
      localStorage.setItem("householdId", data.household.id);
      setInviteLink(data.inviteLink);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося створити простір");
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await joinHousehold(inviteCode);
      localStorage.setItem("householdId", data.household.id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося приєднатися");
    }
  }

  if (inviteLink) {
    return (
      <div className="onboarding-page">
        <h1>Простір створено 🎉</h1>
        <InviteCodeBox inviteLink={inviteLink} />
        <button onClick={() => navigate("/dashboard")}>Перейти до дашборду</button>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <h1>Налаштування спільного простору</h1>

      {!mode && (
        <div className="onboarding-choice">
          <button onClick={() => setMode("create")}>Створити новий простір</button>
          <button onClick={() => setMode("join")}>Приєднатися за кодом</button>
        </div>
      )}

      {mode === "create" && (
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Назва простору (напр. 'Наша квартира')"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Створити</button>
        </form>
      )}

      {mode === "join" && (
        <form onSubmit={handleJoin}>
          <input
            type="text"
            placeholder="Інвайт-код"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Приєднатися</button>
        </form>
      )}
    </div>
  );
}
