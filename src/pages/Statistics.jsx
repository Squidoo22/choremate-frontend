import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStatistics } from "../api/households";
import StatsBar from "../components/StatsBar";

export default function Statistics() {
  const householdId = localStorage.getItem("householdId");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!householdId) return;
    getStatistics(householdId).then((res) => setStats(res.data));
  }, [householdId]);

  if (!stats) return <p>Завантаження статистики...</p>;

  return (
    <div className="statistics-page">
      <Link to="/dashboard">← Назад до дашборду</Link>
      <h1>Статистика навантаження</h1>

      {stats.perMember.map((m) => (
        <StatsBar key={m.userId} name={m.name} percent={m.sharePercent} />
      ))}

      <div className="stats-summary">
        <p>Виконано задач: {stats.totalDone}</p>
        <p>Прострочено: {stats.totalOverdue}</p>
        <p>Найактивніший учасник: {stats.mostActive || "—"}</p>
      </div>
    </div>
  );
}
