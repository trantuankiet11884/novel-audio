"use client";
import { FaChevronRight } from "react-icons/fa";

import { Novel } from "@/lib/apis/api";
import { fallbackImage } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type UpdatedNovelProps = {
  novels: Novel[];
};

export default function UpdatedNovels({ novels }: UpdatedNovelProps) {
  const [coverImage, setCoverImage] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [timeStrings, setTimeStrings] = useState<string[]>([]);

  // Initialize cover images array when component mounts
  useEffect(() => {
    setCoverImage(novels.map((novel) => novel.cover || novel.thumb));
    setMounted(true);
  }, [novels]);

  // Update time strings only on client-side after mounting
  useEffect(() => {
    if (mounted) {
      // Calculate client-side time strings only after component is mounted
      setTimeStrings(
        novels.map((novel) => formatTimeAgo(Number(novel.updatedAt)))
      );
    }
  }, [mounted, novels]);

  // Client-side only time formatter, properly handling Unix timestamp in seconds
  const formatTimeAgo = (timestamp: number) => {
    // Convert Unix timestamp (seconds) to milliseconds for JS Date
    const timestampMs = timestamp * 1000;
    const now = Date.now();
    const diffMs = now - timestampMs;
    const seconds = Math.floor(diffMs / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  };

  const handleImageError = (novelId: string) => {
    setCoverImage((prev) => {
      const newCoverImages = [...prev];
      const index = novels.findIndex((n) => n._id === novelId);
      if (index !== -1) {
        newCoverImages[index] = fallbackImage;
      }
      return newCoverImages;
    });
  };

  return (
    <section className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recently Updated Novels</h2>
        <Link
          href="/search?sort=updatedAt"
          className="flex items-center text-sm text-primary hover:underline font-medium group transition-all"
        >
          View all{" "}
          <FaChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
        {novels.map((novel) => (
          <Link
            key={novel._id}
            href={`/novel/${novel.slug}`}
            className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-4 p-4">
              <div className="hidden sm:block flex-shrink-0">
                <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {mounted && (
                    <Image
                      src={
                        coverImage[
                          novels.findIndex((n) => n._id === novel._id)
                        ] || fallbackImage
                      }
                      alt={novel.title || novel.name || "Novel Image"}
                      fill
                      sizes="100%"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={() => handleImageError(novel._id)}
                    />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 mb-1">
                  <h3 className="text-base font-medium text-primary truncate">
                    {novel.title || novel.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    ({novel.chapters.toLocaleString()} chapters)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-4 text-sm">
                  <span className="text-gray-500 truncate">
                    {novel.genres.slice(0, 3).join(", ")}
                    {novel.genres.length > 3 && "..."}
                  </span>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className="text-gray-500 whitespace-nowrap">
                    Updated{" "}
                    <time className="font-medium text-gray-600 dark:text-gray-300">
                      {!mounted
                        ? "recently"
                        : timeStrings[
                            novels.findIndex((n) => n._id === novel._id)
                          ] || "recently"}
                    </time>
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 self-center">
                <FaChevronRight className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/search?sort=updatedAt"
          className="inline-block px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
        >
          View more updated novels
        </Link>
      </div>
    </section>
  );
}
