import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStatistics } from "../api/households";
import { useHousehold } from "../context/HouseholdContext";
import StatsBar from "../components/StatsBar";

export default function Statistics() {
  const { t } = useTranslation();
  const { householdId } = useHousehold();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!householdId) return;
    getStatistics(householdId).then((res) => setStats(res.data));
  }, [householdId]);

  if (!stats) return <p>{t("stats.loading")}</p>;

  return (
    <div className="statistics-page">
      <Link to="/dashboard">{t("stats.back")}</Link>
      <h1>{t("stats.title")}</h1>

      {stats.perMember.map((m) => (
        <StatsBar key={m.userId} name={m.name} percent={m.sharePercent} />
      ))}

      <div className="stats-summary">
        <p>{t("stats.done", { count: stats.totalDone })}</p>
        <p>{t("stats.overdue", { count: stats.totalOverdue })}</p>
        <p>{t("stats.most_active", { name: stats.mostActive || t("stats.dash") })}</p>
      </div>
    </div>
  );
}
