import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, KeyRound } from "lucide-react";
import { createHousehold, joinHousehold } from "../api/households";
import InviteCodeBox from "../components/InviteCodeBox";
import { ui } from "../ui";

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

  const cardCls = "max-w-md mx-auto mt-8 bg-white rounded-2xl border border-solid border-stone-200 shadow-sm p-6";

  if (inviteLink) {
    return (
      <div className="p-4">
        <div className={`${cardCls} flex flex-col gap-4`}>
          <h1 className="text-xl font-bold text-stone-900">{t("onboarding.created_title")}</h1>
          <InviteCodeBox inviteLink={inviteLink} />
          <button onClick={() => navigate("/dashboard")} className={ui.btnPrimary}>
            {t("onboarding.go_dashboard")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className={`${cardCls} flex flex-col gap-4`}>
        <h1 className="text-xl font-bold text-stone-900">{t("onboarding.title")}</h1>

        {!mode && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setMode("create")}
              className="flex items-center gap-3 p-4 rounded-xl border border-solid border-stone-200 bg-stone-50 hover:bg-stone-100 text-left"
            >
              <span className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </span>
              <span className="font-semibold text-stone-800">{t("onboarding.create_space")}</span>
            </button>
            <button
              onClick={() => setMode("join")}
              className="flex items-center gap-3 p-4 rounded-xl border border-solid border-stone-200 bg-stone-50 hover:bg-stone-100 text-left"
            >
              <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </span>
              <span className="font-semibold text-stone-800">{t("onboarding.join_space")}</span>
            </button>
          </div>
        )}

        {mode === "create" && (
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder={t("onboarding.space_name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={ui.input}
            />
            {error && <p className={ui.error}>{error}</p>}
            <button type="submit" className={ui.btnPrimary}>
              {t("onboarding.create")}
            </button>
          </form>
        )}

        {mode === "join" && (
          <form onSubmit={handleJoin} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder={t("onboarding.invite_placeholder")}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              className={ui.input}
            />
            {error && <p className={ui.error}>{error}</p>}
            <button type="submit" className={ui.btnPrimary}>
              {t("onboarding.join")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
