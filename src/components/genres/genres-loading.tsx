export default function GenresLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="card h-full bg-base-100 shadow-xl border border-base-300 animate-pulse"
        >
          <div className="h-24 bg-base-200"></div>
          <div className="card-body">
            <div className="h-6 bg-base-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-base-200 rounded w-1/3"></div>
            <div className="card-actions justify-end mt-2">
              <div className="h-4 bg-base-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
