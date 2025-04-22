"use client";

import { BookOpen } from "lucide-react";
import { Play, Tag } from "lucide-react";
import { Clock, User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { NovelBookmarkButton } from "./bookmark-button";
import { Novel } from "@/lib/apis/api";
import { fallbackImage } from "@/utils/constants";
import Link from "next/link";

type HeroSectionNovelProps = {
  novel: Novel;
};

const HeroSectionNovel = ({ novel }: HeroSectionNovelProps) => {
  const [coverImage, setCoverImage] = useState(novel.cover || novel.thumb);

  return (
    <div className="relative bg-gray-900 dark:bg-black text-white py-14 px-4 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row gap-10 items-center">
        <div className="relative w-full max-w-xs md:w-80 aspect-[2/3] group">
          <div className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-md z-0"></div>
          <Image
            src={coverImage}
            alt={novel.title || novel.name}
            fill
            className="object-cover rounded-md shadow-md z-10"
            sizes="(max-width: 768px) 100vw, 320px"
            priority={true}
            onError={() => setCoverImage(fallbackImage)}
          />
          <div className="absolute top-2 right-2 bg-gray-200 text-black font-bold px-2 py-1 rounded text-sm z-20">
            {novel.rating.toFixed(1)}/5
          </div>
        </div>

        <div className="flex-1 space-y-5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {novel.title}
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="inline-flex items-center bg-gray-800 dark:bg-gray-900 px-4 py-2 rounded">
              <User className="mr-2 h-4 w-4 text-gray-300" />
              <span className="font-medium">{novel.author}</span>
            </div>
            <div className="inline-flex items-center bg-gray-800 dark:bg-gray-900 px-4 py-2 rounded">
              <Clock className="mr-2 h-4 w-4 text-gray-300" />
              <span className="font-medium">{novel.status}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="flex items-center text-gray-300 mr-1">
              <Tag className="mr-1 h-4 w-4" /> Genres:
            </span>
            {novel.genres.map((genre, idx) => (
              <Link href={`/genres`} key={`${genre}-${idx}`}>
                <Badge
                  variant="outline"
                  className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700 cursor-pointer"
                >
                  {genre}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded border border-gray-700">
            <p className="text-gray-200 leading-relaxed">{novel.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              size="lg"
              className="bg-gray-200 hover:bg-white text-black border-0"
            >
              <Play className="mr-2 h-5 w-5" /> Listen First Chapter
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-transparent hover:bg-gray-800 text-white border-gray-600"
            >
              <BookOpen className="mr-2 h-5 w-5" /> Latest Chapter
            </Button>

            {/* <Link href={`/novel/${novel.slug}/read`}>
              <Button size="lg" variant="outline">
                Listen and Read
              </Button>
            </Link> */}

            {/* <NovelBookmarkButton novelId={novel._id} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionNovel;
