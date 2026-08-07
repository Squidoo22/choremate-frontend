import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Award, Flame, Trophy, Sparkles, CheckCircle2, Crown } from "lucide-react";
import { useHousehold } from "../context/HouseholdContext";
import { listTasks } from "../api/tasks";
import { listTrustDebts } from "../api/debts";

export default function Gamification() {
  const { t } = useTranslation();
  const { householdId, members } = useHousehold();

  const [tasks, setTasks] = useState([]);
  const [debts, setDebts] = useState([]);
  const badges = t("game.badges", { returnObjects: true });

  useEffect(() => {
    if (!householdId) return;
    listTasks(householdId).then((r) => setTasks(r.data));
    listTrustDebts(householdId).then((r) => setDebts(r.data));
  }, [householdId]);

  const sortedMembers = [...members].sort(
    (a, b) => (b.user?.points ?? 0) - (a.user?.points ?? 0)
  );

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-200" />
            <span>{t("game.badge")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {t("game.title")}
          </h2>

          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            {t("game.desc")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span>{t("game.leaderboard")}</span>
          </h3>

          <div className="space-y-3">
            {sortedMembers.map((member, index) => {
              const points = member.user?.points ?? 0;
              const streak = member.user?.streakCount ?? 0;
              const completedCount = tasks.filter(
                (task) => task.assignee?.name === member.name
              ).length;
              const activeDebtsCount = debts.filter(
                (d) => d.debtorId === member.userId && !d.isResolved
              ).length;

              return (
                <div
                  key={member.userId}
                  className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-sm shrink-0">
                      #{index + 1}
                    </div>

                    <div className="text-2xl">{member.avatar}</div>

                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{member.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t("game.works", { n: completedCount })}
                        </span>
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" /> {t("game.streak", { n: streak })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl inline-flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{t("game.points", { n: points })}</span>
                    </div>

                    {activeDebtsCount > 0 && (
                      <div className="text-[11px] text-rose-600 font-semibold mt-1">
                        {t("game.active_debts", { n: activeDebtsCount })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <span>{t("game.badges_title")}</span>
          </h3>

          <div className="space-y-3">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-xl flex items-center justify-center shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{badge.name}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
