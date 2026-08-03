// Спільні Tailwind-класи для форм/модалок — щоб стиль був однорідний.
// `border-solid` обов'язковий на елементах з рамкою: preflight вимкнено,
// а легасі `.app-shell button { border: none }` інакше ховає border-style.
export const ui = {
  backdrop: "fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4",
  card: "bg-white rounded-2xl w-full max-w-md p-6 shadow-xl",
  h2: "text-lg font-bold text-stone-900",
  label: "text-sm font-semibold text-stone-700",
  input:
    "w-full px-3 py-2.5 bg-stone-50 border border-solid border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400",
  btnPrimary:
    "px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-sm hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed",
  btnGhost:
    "px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-semibold text-sm hover:bg-stone-200",
  btnSecondary:
    "px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-semibold text-sm hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed",
  error:
    "text-sm text-rose-600 bg-rose-50 border border-solid border-rose-100 rounded-xl px-3 py-2",
};
