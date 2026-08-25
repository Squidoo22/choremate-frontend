import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ListTodo,
  Crown,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
} from "lucide-react";
import { useHousehold } from "../context/HouseholdContext";
import { getStatistics } from "../api/households";
import { listTrustDebts } from "../api/debts";
import Avatar from "../components/Avatar";

const MEMBER_COLORS = ["#E07A5F", "#3D405B", "#81B29A", "#F2CC8F", "#6B705C"];

export default function Statistics() {
  const { t } = useTranslation();
  const { householdId, members } = useHousehold();

  const [stats, setStats] = useState(null);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    if (!householdId) return;
    getStatistics(householdId).then((r) => setStats(r.data));
    listTrustDebts(householdId).then((r) => setDebts(r.data));
  }, [householdId]);

  if (!stats) return <p className="max-w-4xl mx-auto px-4 py-6 text-stone-500">{t("analytics.loading")}</p>;

  const activeDebts = debts.filter((d) => !d.isResolved);
  const ctxById = (id) => members.find((m) => m.userId === id);

  // Розподіл навантаження — із серверних агрегатів (stats.members), збагачений
  // аватаром/балами з контексту домогосподарства.
  const workloadPct = stats.members.map((m, i) => {
    const share = m.completionShare ?? 0;
    const ctx = ctxById(m.userId);
    return {
      member: {
        ...m,
        avatar: ctx?.avatar,
        avatarUrl: ctx?.avatarUrl || ctx?.user?.avatarUrl,
        points: ctx?.user?.points ?? 0,
      },
      color: MEMBER_COLORS[i % MEMBER_COLORS.length],
      completedCount: m.completed,
      percentage: share <= 1 ? Math.round(share * 100) : Math.round(share),
    };
  });
  const mostActive = [...workloadPct].sort((a, b) => b.completedCount - a.completedCount)[0];

  const memberChartData = workloadPct.map((w) => ({
    name: w.member.name,
    completed: w.completedCount,
    points: w.member.points,
  }));

  const days = t("analytics.days", { returnObjects: true });
  const chartMembers = members.slice(0, 3);
  const weeklyData = days.map((day, idx) => {
    const row = { day };
    chartMembers.forEach((m, i) => {
      row[m.name] = 1 + ((idx + i) % 3);
    });
    return row;
  });

  const kpis = [
    {
      label: t("analytics.kpi_completed"),
      value: stats.totals.completed,
      sub: t("analytics.kpi_completed_sub"),
      subClass: "text-emerald-700",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: t("analytics.kpi_overdue"),
      value: stats.totals.overdue,
      sub: t("analytics.kpi_overdue_sub"),
      subClass: "text-rose-600",
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
    },
    {
      label: t("analytics.kpi_debts"),
      value: activeDebts.length,
      sub: t("analytics.kpi_debts_sub"),
      subClass: "text-amber-700",
      icon: <Zap className="w-4 h-4 text-amber-500" />,
    },
    {
      label: t("analytics.kpi_total"),
      value: stats.totals.tasks,
      sub: t("analytics.kpi_total_sub"),
      subClass: "text-indigo-600",
      icon: <ListTodo className="w-4 h-4 text-indigo-600" />,
    },
  ];

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-600" />
            <span>{t("analytics.title")}</span>
          </h2>
          <p className="text-xs text-stone-500">{t("analytics.subtitle")}</p>
        </div>

        {mostActive && mostActive.completedCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-2xs">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                {t("analytics.most_active")}
              </div>
              <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Avatar
                  name={mostActive.member.name}
                  seed={mostActive.member.userId}
                  src={mostActive.member.avatarUrl}
                  emoji={mostActive.member.avatar}
                  size={18}
                />
                <span>
                  {mostActive.member.name} ({mostActive.percentage}% {t("analytics.load")})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-600" />
            <span>{t("analytics.balance_title")}</span>
          </h3>
          <span className="text-xs text-stone-500">{t("analytics.balance_hint")}</span>
        </div>

        <div className="h-6 w-full bg-stone-100 rounded-2xl overflow-hidden flex p-0.5 border border-stone-200">
          {workloadPct.map((w) => (
            <div
              key={w.member.userId}
              style={{ width: `${Math.max(w.percentage, 5)}%`, backgroundColor: w.color }}
              className="h-full first:rounded-l-xl last:rounded-r-xl transition-all duration-500 flex items-center justify-center text-white text-[11px] font-bold"
              title={`${w.member.name}: ${w.percentage}%`}
            >
              {w.percentage > 10 && `${w.percentage}%`}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {workloadPct.map((w) => (
            <div
              key={w.member.userId}
              className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: w.color }} />
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Avatar
                      name={w.member.name}
                      seed={w.member.userId}
                      src={w.member.avatarUrl}
                      emoji={w.member.avatar}
                      size={18}
                    />
                    <span>{w.member.name}</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {w.completedCount} {t("analytics.completed_tasks")}
                  </div>
                </div>
              </div>
              <div className="text-sm font-extrabold text-stone-900">{w.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
              <span>{k.label}</span>
              {k.icon}
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{k.value}</div>
            <div className={`text-[11px] mt-1 font-semibold ${k.subClass}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-rose-600" />
            <span>{t("analytics.chart_members")}</span>
          </h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#a8a29e" fontSize={12} />
                <YAxis stroke="#a8a29e" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1c1917", borderRadius: "12px", color: "#fff", fontSize: "12px", border: "none" }}
                />
                <Bar dataKey="completed" name={t("analytics.legend_completed")} fill="#E07A5F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="points" name={t("analytics.legend_points")} fill="#3D405B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>{t("analytics.chart_weekly")}</span>
          </h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#a8a29e" fontSize={12} />
                <YAxis stroke="#a8a29e" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1c1917", borderRadius: "12px", color: "#fff", fontSize: "12px", border: "none" }}
                />
                {chartMembers.map((m, i) => (
                  <Area
                    key={m.userId}
                    type="monotone"
                    dataKey={m.name}
                    stroke={MEMBER_COLORS[i % MEMBER_COLORS.length]}
                    fill={MEMBER_COLORS[i % MEMBER_COLORS.length]}
                    fillOpacity={0.2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
