// Детермінований аватар: за seed (id або ім'я) стабільно обираємо градієнт
// із теплої палітри застосунку й показуємо ініціали. Пріоритет відображення:
// реальне фото (src) → готовий емодзі (моки) → згенерований аватар.
// Якщо фото не завантажилось (битий/недоступний URL) — падаємо на емодзі/ініціали.

import { useEffect, useState } from "react";

const GRADIENTS = [
  ["#f97316", "#ec4899"], // orange → pink (акцент застосунку)
  ["#f43f5e", "#f59e0b"], // rose → amber
  ["#8b5cf6", "#ec4899"], // violet → pink
  ["#0ea5e9", "#6366f1"], // sky → indigo
  ["#10b981", "#14b8a6"], // emerald → teal
  ["#f59e0b", "#ef4444"], // amber → red
  ["#6366f1", "#8b5cf6"], // indigo → violet
  ["#14b8a6", "#0ea5e9"], // teal → sky
  ["#ec4899", "#f43f5e"], // pink → rose
  ["#84cc16", "#10b981"], // lime → emerald
];

function hash(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase();
}

export default function Avatar({ name = "", seed, src, emoji, size = 40, className = "" }) {
  const [imgFailed, setImgFailed] = useState(false);
  // Скидаємо помилку, якщо змінився src (напр. інший учасник).
  useEffect(() => setImgFailed(false), [src]);

  const style = { width: size, height: size };
  const base =
    "inline-flex items-center justify-center rounded-full shrink-0 overflow-hidden select-none";

  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={name}
        style={style}
        className={`${base} object-cover ${className}`}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
      />
    );
  }

  if (emoji) {
    return (
      <span
        aria-hidden="true"
        style={{ ...style, fontSize: size * 0.5 }}
        className={`${base} bg-white shadow-sm ${className}`}
      >
        {emoji}
      </span>
    );
  }

  const [from, to] = GRADIENTS[hash(seed || name) % GRADIENTS.length];
  return (
    <span
      aria-hidden="true"
      title={name}
      style={{
        ...style,
        fontSize: size * 0.4,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      className={`${base} font-bold text-white ${className}`}
    >
      {initials(name)}
    </span>
  );
}
