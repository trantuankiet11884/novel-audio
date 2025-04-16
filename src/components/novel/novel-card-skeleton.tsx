export function NovelCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "horizontal";
}) {
  if (variant === "horizontal") {
    return (
      <div className="flex items-start space-x-4 p-3 rounded-lg">
        <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted animate-pulse" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
          <div className="flex items-center mt-2 space-x-3">
            <div className="h-3 bg-muted rounded animate-pulse w-20" />
            <div className="h-3 bg-muted rounded animate-pulse w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="relative pt-[140%] bg-muted animate-pulse" />
      <div className="flex flex-col flex-1 p-3 space-y-2">
        <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
        <div className="mt-auto flex flex-col items-start gap-1 md:flex-row md:justify-between">
          <div className="h-3 bg-muted rounded animate-pulse w-24" />
          <div className="h-3 bg-muted rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}
