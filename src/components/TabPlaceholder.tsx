export default function TabPlaceholder({ icon: Icon, title, subtitle }) {
  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-10">
      <div className="bg-white border border-stone-200 rounded-3xl p-10 text-center shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          {Icon && <Icon className="w-7 h-7" />}
        </div>
        <h2 className="text-xl font-extrabold text-stone-900">{title}</h2>
        <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">{subtitle}</p>
      </div>
    </div>
  );
}
