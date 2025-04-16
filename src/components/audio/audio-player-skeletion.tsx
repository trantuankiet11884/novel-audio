import { Skeleton } from "@/components/ui/skeleton";
import { SkipBack, SkipForward, Play, Rewind, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerSkeletonProps {
  isMobileView?: boolean;
}

export default function AudioPlayerSkeleton({
  isMobileView = false,
}: AudioPlayerSkeletonProps) {
  return (
    <div
      className={`mx-auto w-full rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 ${
        isMobileView ? "fixed bottom-0 left-0 right-0 z-50" : ""
      }`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm"
          >
            <SkipBack className="h-4 w-4" />
            <span className="hidden sm:inline">Previous Chapter</span>
          </Button>

          <Skeleton className="h-5 w-32 rounded-md" />

          <Button
            variant="outline"
            disabled
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" disabled className="h-10 w-10">
            <Rewind className="h-5 w-5" />
          </Button>

          <Button variant="outline" size="icon" disabled className="h-12 w-12">
            <Play className="h-6 w-6" />
          </Button>

          <Button variant="outline" size="icon" disabled className="h-10 w-10">
            <FastForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="my-4 flex justify-center">
          <Skeleton className="h-10 w-64 rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
