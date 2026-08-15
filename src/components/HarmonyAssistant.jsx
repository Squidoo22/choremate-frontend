import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, X, Send, HeartHandshake } from "lucide-react";
import { sendAssistantMessage } from "../api/assistant";
import { useAuth } from "../context/AuthContext";
import { useHousehold } from "../context/HouseholdContext";
import { listTasks } from "../api/tasks";
import { listTrustDebts } from "../api/debts";

export default function HarmonyAssistant() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { householdId, household, members } = useHousehold();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [context, setContext] = useState(null);
  const scrollRef = useRef(null);

  const suggestions = t("assistant.suggestions", { returnObjects: true });

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("assistant.greeting") }]);
    }
  }, [open]);

  // Збираємо реальний стан сім'ї при відкритті, щоб радити конкретно
  useEffect(() => {
    if (!open || !householdId) return;
    const nameOf = (id) => members.find((m) => m.userId === id)?.name;
    Promise.all([listTasks(householdId), listTrustDebts(householdId)])
      .then(([tasksRes, debtsRes]) => {
        const tasks = tasksRes.data || [];
        const debts = (debtsRes.data || []).filter((d) => !d.isResolved);
        const assignedByName = {};
        const doneByName = {};
        tasks.forEach((task) => {
          const n = task.assignee?.name;
          if (!n) return;
          assignedByName[n] = (assignedByName[n] || 0) + 1;
          if (task.status === "DONE") doneByName[n] = (doneByName[n] || 0) + 1;
        });
        setContext({
          household: household?.name,
          me: user?.name,
          members: members.map((m) => ({
            name: m.name,
            points: m.user?.points ?? 0,
            streak: m.user?.streakCount ?? 0,
          })),
          tasks: {
            active: tasks.filter((x) => x.status !== "DONE").length,
            overdue: tasks.filter((x) => x.status === "OVERDUE").length,
            done: tasks.filter((x) => x.status === "DONE").length,
            assignedByName,
            doneByName,
          },
          debts: debts.map((d) => ({
            debtor: nameOf(d.debtorId),
            creditor: nameOf(d.creditorId),
            description: d.description,
          })),
        });
      })
      .catch(() => {});
  }, [open, householdId, members]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const { text: reply } = await sendAssistantMessage(next, i18n.language, context);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: t("assistant.error") }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("assistant.open")}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center hover:from-orange-600 hover:to-rose-600 transition-all"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-3xl border border-stone-200 shadow-xl flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-3 flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">{t("assistant.title")}</div>
              <div className="text-[11px] text-rose-100">{t("assistant.subtitle")}</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("household.close")}
              className="p-1 rounded-lg bg-transparent text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-stone-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-rose-600 text-white rounded-br-sm"
                      : "bg-white border border-stone-200 text-stone-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 text-stone-400 px-3 py-2 rounded-2xl rounded-bl-sm text-sm">
                  …
                </div>
              </div>
            )}

            {messages.length <= 1 && !busy && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-2.5 border-t border-stone-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("assistant.placeholder")}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label={t("assistant.send")}
              className="w-9 h-9 shrink-0 rounded-xl bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
