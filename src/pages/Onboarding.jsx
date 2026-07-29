import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createHousehold, joinHousehold } from "../api/households";
import InviteCodeBox from "../components/InviteCodeBox";

export default function Onboarding() {
  const { t } = useTranslation();
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
      setError(err.response?.data?.error || t("onboarding.err_create"));
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
      setError(err.response?.data?.error || t("onboarding.err_join"));
    }
  }

  if (inviteLink) {
    return (
      <div className="onboarding-page">
        <h1>{t("onboarding.created_title")}</h1>
        <InviteCodeBox inviteLink={inviteLink} />
        <button onClick={() => navigate("/dashboard")}>{t("onboarding.go_dashboard")}</button>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <h1>{t("onboarding.title")}</h1>

      {!mode && (
        <div className="onboarding-choice">
          <button onClick={() => setMode("create")}>{t("onboarding.create_space")}</button>
          <button onClick={() => setMode("join")}>{t("onboarding.join_space")}</button>
        </div>
      )}

      {mode === "create" && (
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder={t("onboarding.space_name_placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">{t("onboarding.create")}</button>
        </form>
      )}

      {mode === "join" && (
        <form onSubmit={handleJoin}>
          <input
            type="text"
            placeholder={t("onboarding.invite_placeholder")}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">{t("onboarding.join")}</button>
        </form>
      )}
    </div>
  );
}
