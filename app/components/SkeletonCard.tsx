export function SkeletonProductCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-6 w-1/3 rounded mt-3" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="w-full min-h-[70vh] skeleton rounded-none" />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: `${75 + Math.random() * 25}%` }}
        />
      ))}
    </div>
  );
}
