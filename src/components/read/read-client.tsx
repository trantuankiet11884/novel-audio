"use client";

import TextAudioPlayer from "@/components/audio/text-audio-player";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ReadClientProps {
  novel: any;
  novelId: string;
  chapterIndex: number;
  totalChapters: number;
  novelSlug: string;
}

export default function ReadClient({
  novel,
  novelId,
  chapterIndex,
  totalChapters,
  novelSlug,
}: ReadClientProps) {
  const router = useRouter();
  // Xử lý chuyển chapter ở client component
  const handleChapterChange = (newIndex: number) => {
    router.push(`/novel/${novelSlug}/read?chapter=${newIndex + 1}`, {
      scroll: false,
    });
  };

  return (
    <>
      {/* Header Section */}
      <div className="relative bg-gray-900 dark:bg-black text-white py-8 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto">
          <Link
            href={`/novel/${novelSlug}`}
            className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-4"
          >
            <BookOpen className="h-4 w-4 mr-1" /> Back to Novel
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            {novel.title}
          </h1>
          <p className="text-gray-300">
            {novel.author} • Chapter {chapterIndex + 1} of {totalChapters}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 mb-6 rounded-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Read & Listen</h2>
              <Link href={`/novel/${novelSlug}`}>
                <Button variant="outline" size="sm">
                  View Novel Details
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            <TextAudioPlayer
              novel={novel}
              novelId={novelId}
              chapterIndex={chapterIndex}
              totalChapters={totalChapters}
              novelSlug={novelSlug}
              onChapterChange={handleChapterChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
