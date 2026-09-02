// Плейсхолдери під час першого завантаження — замість порожнього екрана.

export function TaskListSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-3 animate-pulse"
        >
          <div className="shrink-0 w-6 h-6 rounded-full bg-stone-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-stone-200" />
            <div className="flex gap-2">
              <div className="h-3 w-16 rounded-full bg-stone-100" />
              <div className="h-3 w-20 rounded-full bg-stone-100" />
            </div>
          </div>
          <div className="shrink-0 h-6 w-20 rounded-full bg-stone-100" />
        </div>
      ))}
    </div>
  );
}

export function WishlistSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs animate-pulse flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 w-20 rounded-full bg-stone-100" />
              <div className="h-5 w-5 rounded-full bg-stone-100" />
            </div>
            <div className="h-5 w-2/3 rounded bg-stone-200" />
            <div className="h-3 w-full rounded bg-stone-100 mt-2" />
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-stone-100" />
            <div className="h-5 w-14 rounded-md bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DebtListSkeleton({ count = 2 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs animate-pulse space-y-3"
        >
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded-lg bg-stone-100" />
            <div className="h-6 w-24 rounded-lg bg-stone-100" />
          </div>
          <div className="h-5 w-1/2 rounded bg-stone-200" />
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-stone-100" />
            <div className="h-7 w-24 rounded-xl bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
