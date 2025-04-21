"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import ChapterList from "@/components/novel/chapter-list";
import { Chapter, Novel } from "@/lib/apis/api";
import TextAudioPlayer from "../audio/text-audio-player";
import Link from "next/link";
import { Button } from "../ui/button";

interface NovelPageClientProps {
  novelId: string;
  novelSlug: string;
  chapters: Chapter[];
  initialChapterIndex: number;
  novels: Novel;
}

export default function NovelPageClient({
  novelId,
  novelSlug,
  chapters,
  initialChapterIndex,
  novels,
}: NovelPageClientProps) {
  const [currentChapterIndex, setCurrentChapterIndex] =
    useState(initialChapterIndex);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedChapter = localStorage.getItem(`novel_${novelSlug}_chapter`);
    if (savedChapter !== null) {
      const savedIndex = parseInt(savedChapter, 10);
      if (
        savedIndex !== currentChapterIndex &&
        !isNaN(savedIndex) &&
        savedIndex >= 0 &&
        savedIndex < chapters.length
      ) {
        setCurrentChapterIndex(savedIndex);
      }
    }
  }, [novelSlug, chapters.length]);

  useEffect(() => {
    localStorage.setItem(
      `novel_${novelSlug}_chapter`,
      currentChapterIndex.toString()
    );

    const newUrl = `${pathname}?page=${currentChapterIndex}`;
    router.replace(newUrl, { scroll: false });
  }, [currentChapterIndex, novelSlug, pathname, router]);

  const handleChapterChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < chapters.length) {
      setCurrentChapterIndex(newIndex);
    }
  };

  return (
    <div className="w-full gap-6 relative">
      {/* Chapter List */}
      <div className="w-full">
        <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black h-full rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="flex items-center text-lg font-semibold">
              <span className="mr-2">📖</span> Chapter List
              <span className="ml-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded">
                {chapters.length}
              </span>
            </h2>
          </div>
          <div className="p-6">
            <ChapterList
              chapters={chapters}
              novelSlug={novelSlug}
              currentChapterIndex={currentChapterIndex}
              onChapterSelect={handleChapterChange}
            />
          </div>
          <TextAudioPlayer
            novel={novels}
            novelId={novelId}
            chapterIndex={currentChapterIndex}
            totalChapters={chapters.length}
            novelSlug={novelSlug}
            onChapterChange={handleChapterChange}
          />
        </div>
      </div>
    </div>
  );
}
