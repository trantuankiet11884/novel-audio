import { Novel } from "@/lib/apis/api";
import { NovelCard } from "@/components/audio/novel-card";

interface NovelsGridProps {
  novels: Novel[];
}

export function NovelsGrid({ novels }: NovelsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {novels.map((novel, idx) => (
        <NovelCard key={`${novel._id} - ${idx}`} novel={novel} />
      ))}
    </div>
  );
}
