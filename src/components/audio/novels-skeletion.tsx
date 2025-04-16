import { Skeleton } from "@/components/ui/skeleton";

export function NovelsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        >
          <Skeleton className="w-full h-0 pt-[140%] rounded-t-lg" />
          <div className="p-3">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-1" />
            <div className="flex justify-between mt-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
