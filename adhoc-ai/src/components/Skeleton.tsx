export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-panel border border-white/5 rounded-3xl p-6 shadow-lg animate-pulse w-full">
      <div className="h-6 bg-white/5 rounded-lg w-1/3 mb-6"></div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center space-x-3 w-2/3">
              <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0"></div>
              <div className="space-y-2 w-full">
                <div className="h-4 bg-white/5 rounded w-3/4"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-6 bg-white/5 rounded-full w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl animate-pulse w-full">
      <div className="h-14 bg-black/20 border-b border-white/5 flex items-center px-6 space-x-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-white/5 rounded w-24"></div>
        ))}
      </div>
      <div className="p-6 space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between items-center space-x-4">
            <div className="h-5 bg-white/5 rounded w-1/4"></div>
            <div className="h-5 bg-white/5 rounded w-1/4"></div>
            <div className="h-5 bg-white/5 rounded w-1/5"></div>
            <div className="h-7 bg-white/5 rounded-full w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCircular() {
  return (
    <div className="bg-panel border border-white/5 rounded-3xl p-6 shadow-lg animate-pulse w-full flex flex-col items-center justify-between min-h-[250px]">
      <div className="h-5 bg-white/5 rounded w-1/2 align-self-start self-start"></div>
      <div className="w-32 h-32 rounded-full border-[8px] border-white/5 flex items-center justify-center my-4">
        <div className="w-16 h-16 rounded-full bg-white/5"></div>
      </div>
      <div className="h-4 bg-white/5 rounded w-2/3 mt-2"></div>
    </div>
  );
}
