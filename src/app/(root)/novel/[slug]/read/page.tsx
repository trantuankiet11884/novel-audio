import ReadClient from "@/components/read/read-client";
import { Button } from "@/components/ui/button";
import config from "@/config/data";
import { fetchChapters, fetchNovelBySlug } from "@/lib/apis/api";
import { fallbackImage } from "@/utils/constants";
import { BookOpen } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

interface ReadPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ chapter?: string }>;
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
    title: `Read & Listen: ${novel.title}`,
    description:
      novel.description?.substring(0, 160) ||
      "Read and listen to this novel with synchronized text and audio",
    openGraph: {
      title: `Read & Listen: ${novel.title}`,
      description:
        novel.description?.substring(0, 160) ||
        "Read and listen to this novel with synchronized text and audio",
      url: `${config.siteUrl}/novel/${resolvedParams}/read`,
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
      canonical: `${config.siteUrl}/novel/${resolvedParams}/read`,
    },
  };
}

export default async function ReadPage({
  params,
  searchParams,
}: ReadPageProps) {
  const resolvedParams = (await params).slug;
  const { chapter } = await searchParams;

  const { novel, sources } = await fetchNovelBySlug(resolvedParams);
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
  const initialChapterIndex = chapter ? parseInt(chapter, 10) - 1 : 0;

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
            url: `${config.siteUrl}/novel/${resolvedParams}/read`,
            image: novel.cover || novel.thumb || fallbackImage,
          }),
        }}
      />
      <div className="min-h-screen bg-white dark:bg-black">
        <Suspense
          fallback={
            <div className="p-8 text-center">Loading novel player...</div>
          }
        >
          <ReadClient
            novel={novel}
            novelId={novel._id}
            chapterIndex={initialChapterIndex}
            totalChapters={chapters.length}
            novelSlug={resolvedParams}
          />
        </Suspense>
      </div>
    </>
  );
}
