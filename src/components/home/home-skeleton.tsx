export function HomeSkeleton() {
  return (
    <div className="min-h-screen flex flex-col animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 bg-gray-200 dark:bg-gray-800 mb-4"></div>

      {/* Main content skeleton */}
      <div className="flex-1 container mx-auto px-4">
        {/* Hero section skeleton */}
        <div className="w-full h-72 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8"></div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-300 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="h-full bg-gray-300 dark:bg-gray-700 rounded p-4">
              <div className="h-8 w-full bg-gray-400 dark:bg-gray-600 rounded mb-4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-400 dark:bg-gray-600 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-gray-800 mt-auto"></div>
    </div>
  );
}
