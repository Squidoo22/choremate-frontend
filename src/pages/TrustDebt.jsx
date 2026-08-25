import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Clock,
  Dices,
  Plus,
  HeartHandshake,
  Utensils,
  Coffee,
  Film,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useHousehold } from "../context/HouseholdContext";
import {
  listTrustDebts,
  createTrustDebt,
  redeemTrustDebt,
  confirmTrustDebt,
  deleteTrustDebt,
} from "../api/debts";
import Avatar from "../components/Avatar";

const CUSTOM = "__custom__";

function categoryIcon(category) {
  switch (category) {
    case "cooking":
      return <Utensils className="w-4 h-4 text-orange-600" />;
    case "coffee":
      return <Coffee className="w-4 h-4 text-amber-600" />;
    case "movie":
      return <Film className="w-4 h-4 text-indigo-600" />;
    default:
      return <HeartHandshake className="w-4 h-4 text-rose-600" />;
  }
}

export default function TrustDebt() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { householdId, members } = useHousehold();

  const presets = t("debts.presets", { returnObjects: true });
  const currentMemberId = user?.id || members[0]?.userId || "";
  const locale = i18n.language?.startsWith("en") ? "en-US" : "uk-UA";

  const [debts, setDebts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [debtorId, setDebtorId] = useState("");
  const [creditorId, setCreditorId] = useState("");
  const [description, setDescription] = useState(presets[0]);
  const [customDescription, setCustomDescription] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [spunResult, setSpunResult] = useState(null);

  async function load() {
    if (!householdId) return;
    const { data } = await listTrustDebts(householdId);
    setDebts(data);
  }

  useEffect(() => {
    load();
  }, [householdId]);

  useEffect(() => {
    if (!members.length) return;
    setCreditorId(currentMemberId || members[0].userId);
    const other = members.find((m) => m.userId !== currentMemberId);
    setDebtorId(other?.userId || members[0].userId);
  }, [members, currentMemberId]);

  const openDebts = debts.filter((d) => !d.isResolved);
  const resolvedDebts = debts.filter((d) => d.isResolved);
  const memberById = (id) => members.find((m) => m.userId === id);

  function spinWheel() {
    if (spinning) return;
    setSpinning(true);
    setSpunResult(null);
    let counter = 0;
    const interval = setInterval(() => {
      setSpunResult(presets[Math.floor(Math.random() * presets.length)]);
      counter += 1;
      if (counter > 15) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100);
  }

  async function handleRedeem(id) {
    await redeemTrustDebt(id);
    load();
  }

  async function handleConfirm(id) {
    await confirmTrustDebt(id);
    load();
  }

  async function handleDelete(id) {
    await deleteTrustDebt(id);
    load();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const finalDesc = description === CUSTOM ? customDescription : description;
    if (!finalDesc.trim()) return;
    await createTrustDebt(householdId, {
      debtorId,
      creditorId,
      description: finalDesc.trim(),
      category: "custom",
    });
    setShowModal(false);
    setCustomDescription("");
    load();
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("debts.badge")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {t("debts.title")}
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
            {t("debts.desc")}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t("debts.issue")}</span>
            </button>

            <button
              onClick={spinWheel}
              disabled={spinning}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Dices className={`w-4 h-4 ${spinning ? "animate-spin text-amber-400" : ""}`} />
              <span>{t("debts.wheel")}</span>
            </button>
          </div>

          {spunResult && (
            <div className="mt-4 p-3.5 bg-white/10 border border-rose-400/40 rounded-2xl backdrop-blur-sm animate-fade-in flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-rose-200">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  {t("debts.spun_prefix")}{" "}
                  <strong className="text-white text-sm font-bold">{spunResult}</strong>
                </span>
              </div>
              <button
                onClick={() => {
                  setDescription(spunResult);
                  setShowModal(true);
                }}
                className="px-3 py-1 bg-amber-400 text-stone-900 font-bold text-xs rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap"
              >
                {t("debts.use")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>
              {t("debts.active_title")} ({openDebts.length})
            </span>
          </h3>
          <span className="text-xs text-stone-500">{t("debts.active_hint")}</span>
        </div>

        {openDebts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openDebts.map((debt) => {
              const debtor = memberById(debt.debtorId);
              const creditor = memberById(debt.creditorId);
              const isAwaiting = debt.status === "AWAITING_CONFIRMATION";
              const isDebtor = debt.debtorId === currentMemberId;
              const isCreditor = debt.creditorId === currentMemberId;
              return (
                <div
                  key={debt.id}
                  className={`bg-white border rounded-2xl p-4 shadow-xs hover:shadow-md transition-all ${
                    isAwaiting ? "border-amber-300 ring-1 ring-amber-100" : "border-rose-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-800 font-semibold rounded-lg border border-rose-200 flex items-center gap-1.5">
                          <Avatar
                            name={debtor?.name}
                            seed={debtor?.userId}
                            src={debtor?.avatarUrl || debtor?.user?.avatarUrl}
                            emoji={debtor?.avatar || debtor?.user?.avatar}
                            size={18}
                          />
                          <span>{debtor?.name || "—"}</span>
                        </span>
                        <span className="text-stone-400 font-medium">{t("debts.owes")}</span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold rounded-lg border border-emerald-200 flex items-center gap-1.5">
                          <Avatar
                            name={creditor?.name}
                            seed={creditor?.userId}
                            src={creditor?.avatarUrl || creditor?.user?.avatarUrl}
                            emoji={creditor?.avatar || creditor?.user?.avatar}
                            size={18}
                          />
                          <span>{creditor?.name || "—"}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                        {categoryIcon(debt.category)}
                        <span>{debt.description}</span>
                      </h4>

                      {debt.taskTitle && (
                        <p className="text-xs text-stone-500 bg-stone-50 p-2 rounded-xl border border-stone-200">
                          📌 {t("debts.from_task")} <strong>«{debt.taskTitle}»</strong>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(debt.id)}
                      className="text-stone-300 hover:text-rose-600 transition-colors p-1 bg-transparent"
                      title={t("debts.delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-400">
                      {t("debts.created")}{" "}
                      {new Date(debt.createdAt).toLocaleDateString(locale)}
                    </span>

                    {isAwaiting ? (
                      isCreditor ? (
                        <button
                          onClick={() => handleConfirm(debt.id)}
                          className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t("debts.confirm")}</span>
                        </button>
                      ) : (
                        <span
                          title={t("debts.awaiting_hint")}
                          className="px-3 py-1.5 bg-amber-50 text-amber-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t("debts.awaiting_badge")}</span>
                        </span>
                      )
                    ) : isDebtor ? (
                      <button
                        onClick={() => handleRedeem(debt.id)}
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t("debts.redeem")}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold text-lg">
              ✨
            </div>
            <h4 className="text-sm font-bold text-emerald-900">{t("debts.empty_title")}</h4>
            <p className="text-xs text-emerald-700 mt-1 max-w-xs mx-auto">
              {t("debts.empty_sub")}
            </p>
          </div>
        )}
      </div>

      {resolvedDebts.length > 0 && (
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <h3 className="text-sm font-bold text-stone-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {t("debts.history_title")} ({resolvedDebts.length})
            </span>
          </h3>

          <div className="space-y-2">
            {resolvedDebts.map((debt) => {
              const debtor = memberById(debt.debtorId);
              const creditor = memberById(debt.creditorId);
              return (
                <div
                  key={debt.id}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between gap-2 text-xs text-stone-600 opacity-80"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>{debtor?.name}</strong> {t("debts.resolved_done")}{" "}
                      <strong>{creditor?.name}</strong>: {debt.description}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                    {t("debts.resolved_badge")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>{t("debts.modal_title")}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold bg-transparent"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t("debts.debtor")}
                  </label>
                  <select
                    value={debtorId}
                    onChange={(e) => setDebtorId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none"
                  >
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.avatar} {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t("debts.creditor")}
                  </label>
                  <select
                    value={creditorId}
                    onChange={(e) => setCreditorId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none"
                  >
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.avatar} {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t("debts.subject")}
                </label>
                <select
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none"
                >
                  {presets.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value={CUSTOM}>{t("debts.custom_option")}</option>
                </select>

                {description === CUSTOM && (
                  <input
                    type="text"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder={t("debts.custom_placeholder")}
                    className="w-full mt-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  />
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-medium"
                >
                  {t("debts.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-2xs"
                >
                  {t("debts.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
