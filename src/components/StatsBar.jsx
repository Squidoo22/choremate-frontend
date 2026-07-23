export default function StatsBar({ name, percent }) {
  return (
    <div className="stats-bar">
      <div className="stats-bar__label">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="stats-bar__track">
        <div className="stats-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
