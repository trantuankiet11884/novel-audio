"use client";
import { Novel } from "@/lib/apis/api";
import { fallbackImage } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar, FaHeadphones, FaBook } from "react-icons/fa";

interface NovelCardProps {
  novel: Novel;
  variant?: "default" | "horizontal";
}

export function NovelCard({ novel, variant = "default" }: NovelCardProps) {
  const [coverImage, setCoverImage] = useState(novel.cover || novel.thumb);

  if (variant === "horizontal") {
    return (
      <Link
        href={`/novel/${novel.slug}`}
        className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-md shadow-sm">
          <Image
            src={coverImage || fallbackImage}
            alt={novel.name || novel.title}
            fill
            className="object-cover"
            sizes="56px"
            onError={() => setCoverImage(fallbackImage)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-2">{novel.name}</h3>
          {novel.author && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {novel.author}
            </p>
          )}
          <div className="flex items-center mt-2 space-x-3">
            <div className="flex items-center text-xs text-gray-500">
              <FaBook className="mr-1 h-3 w-3" />
              <span>{novel.chapters.toLocaleString()} Chapters</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <FaHeadphones className="mr-1 h-3 w-3" />
              <span>{novel.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/novel/${novel.slug}`}
      className="flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative pt-[140%]">
        <Image
          src={coverImage || fallbackImage}
          alt={novel.name || novel.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          onError={() => setCoverImage(fallbackImage)}
        />
      </div>
      <div className="flex flex-col flex-1 p-3">
        <h3 className="font-medium line-clamp-1 mb-2">{novel.name}</h3>
        <div className="mt-auto flex flex-col items-start gap-1 md:flex-row md:justify-between text-xs">
          <div className="flex items-center text-gray-500">
            <FaBook className="mr-1 h-3 w-3" />
            <span>{novel.chapters.toLocaleString()} Chapters</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <FaHeadphones className="mr-1 h-3 w-3" />
            <span>{novel.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
