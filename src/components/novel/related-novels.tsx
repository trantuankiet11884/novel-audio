import React from "react";
import { NovelCard } from "../audio/novel-card";
import { Novel } from "@/lib/apis/api";

interface RelatedNovelsProps {
  sameNovels: Novel[];
}

const RelatedNovels = ({ sameNovels }: RelatedNovelsProps) => {
  return (
    <div className="mt-32 bg-gray-50 dark:bg-gray-900 p-5 rounded border border-gray-200 dark:border-gray-800">
      <h3 className="font-semibold text-lg mb-3">
        Novels from the same author
      </h3>
      <div className="relative">
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex space-x-4 min-w-max">
            {sameNovels.map((novel) => (
              <div key={novel._id} className="w-48 flex-shrink-0">
                <NovelCard novel={novel} />
              </div>
            ))}
          </div>
        </div>
        {sameNovels.length > 5 && (
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white dark:from-black pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default RelatedNovels;
