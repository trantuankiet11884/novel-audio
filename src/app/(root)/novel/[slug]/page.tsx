import { NovelCard } from "@/components/audio/novel-card";
import { NovelBookmarkButton } from "@/components/novel/bookmark-button";
import NovelPageClient from "@/components/novel/novel-client";
import AudioPlayerSkeleton from "@/components/audio/audio-player-skeletion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import config from "@/config/data";
import { fetchChapters, fetchNovelBySlug, fetchNovels } from "@/lib/apis/api";
import { fallbackImage } from "@/utils/constants";
import { BookOpen, Clock, Play, Star, Tag, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface NovelPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ source?: string; page?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = (await params).slug;
  const { novel } = await fetchNovelBySlug(resolvedParams);

  if (!novel) {
    return {
      title: "Novel Not Found",
      description: "The requested novel could not be found",
    };
  }

  return {
    title: novel.title,
    description:
      novel.description?.substring(0, 160) ||
      "Listen to this novel in audio format on MTL Novel Audio",
    openGraph: {
      title: novel.title,
      description:
        novel.description?.substring(0, 160) ||
        "Listen to this novel in audio format",
      url: `${config.siteUrl}/novel/${resolvedParams}`,
      type: "book",
      images: [
        {
          url: novel.cover || novel.thumb || fallbackImage,
          width: 800,
          height: 600,
          alt: novel.title,
        },
      ],
    },
    alternates: {
      canonical: `${config.siteUrl}/novel/${resolvedParams}`,
    },
  };
}

export default async function NovelPage({
  params,
  searchParams,
}: NovelPageProps) {
  const resolvedParams = (await params).slug;
  const { source, page } = await searchParams;

  const { novel, sources } = await fetchNovelBySlug(resolvedParams, source);
  const { novels: sameNovels } = await fetchNovels({
    author: novel?.author || "",
    limit: 10,
  });
  if (!novel) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-full p-6 inline-block mx-auto">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Novel Not Found</h1>

          <p className="text-gray-600 dark:text-gray-400">
            We couldn't find the novel you're looking for. It may have been
            removed or the URL might be incorrect.
          </p>

          <div className="pt-4">
            <Link href="/novels">
              <Button className="bg-black hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700">
                Browse All Novels
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const chapters = await fetchChapters(novel._id);
  const totalChapters = chapters.length;
  const initialChapterIndex = Number(page) || 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: novel.title,
            author: {
              "@type": "Person",
              name: novel.author,
            },
            description: novel.description,
            genre: novel.genres,
            publisher: {
              "@type": "Organization",
              name: config.title,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: novel.rating.toFixed(1),
              bestRating: "5",
              ratingCount: "100",
            },
            url: `${config.siteUrl}/novel/${resolvedParams}`,
            image: novel.cover || novel.thumb || fallbackImage,
          }),
        }}
      />
      <div className="min-h-screen bg-white dark:bg-black">
        {/* Hero Section */}
        <div className="relative bg-gray-900 dark:bg-black text-white py-14 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto flex flex-col md:flex-row gap-10 items-center">
            <div className="relative w-full max-w-xs md:w-80 aspect-[2/3] group">
              <div className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-md z-0"></div>
              <Image
                src={novel.cover || novel.thumb || fallbackImage}
                alt={novel.title || novel.name}
                fill
                className="object-cover rounded-md shadow-md z-10"
                sizes="(max-width: 768px) 100vw, 320px"
                priority
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
                  <Link
                    href={`/genres/${encodeURIComponent(genre.toLowerCase())}`}
                    key={`${genre}-${idx}`}
                  >
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
                <p className="text-gray-200 leading-relaxed">
                  {novel.description}
                </p>
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

                <NovelBookmarkButton novelId={novel._id} />

                {chapters.length > 0 && (
                  <div className="flex items-center text-gray-300 ml-2 bg-gray-800 px-3 py-1 rounded">
                    <span className="font-medium">
                      {totalChapters} chapters
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="chapters" className="space-y-6">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto dark:bg-gray-900 rounded p-1">
              <TabsTrigger
                value="chapters"
                className="rounded data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Chapter List
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="rounded data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Information
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chapters">
              <NovelPageClient
                novels={novel}
                novelId={novel._id}
                novelSlug={resolvedParams}
                chapters={chapters}
                initialChapterIndex={initialChapterIndex}
              />
            </TabsContent>

            <TabsContent value="info">
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <CardHeader className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <CardTitle>Novel Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-lg flex items-center mb-2">
                          <User className="mr-2 h-5 w-5" /> Author
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {novel.author}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-lg flex items-center mb-2">
                          <Tag className="mr-2 h-5 w-5" /> Genres
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {novel.genres.map((genre) => (
                            <Link
                              href={`/genres/${encodeURIComponent(
                                genre.toLowerCase()
                              )}`}
                              key={genre}
                            >
                              <Badge className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                                {genre}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-lg flex items-center mb-2">
                          <Clock className="mr-2 h-5 w-5" /> Status
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {novel.status}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-lg flex items-center mb-2">
                          <Star className="mr-2 h-5 w-5" /> Rating
                        </h3>
                        <div className="flex items-center">
                          <span className="text-xl font-bold">
                            {novel.rating.toFixed(1)}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-1">
                            /5
                          </span>
                          <div className="ml-3 flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(novel.rating)
                                    ? "fill-gray-900 text-gray-900 dark:fill-gray-200 dark:text-gray-200"
                                    : i < novel.rating
                                    ? "fill-gray-400 text-gray-400"
                                    : "text-gray-300 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-5 rounded border border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {novel.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-5 rounded border border-gray-200 dark:border-gray-800">
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
        </div>
      </div>
    </>
  );
}
