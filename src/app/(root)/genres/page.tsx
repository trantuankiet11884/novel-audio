import {
  ClientSearch,
  ClientGenrePage,
} from "@/components/genres/genres-client";
import { fetchGenres, fetchNovels } from "@/lib/apis/api";
import { Suspense } from "react";
import { Metadata } from "next";
import config from "@/config/data";

export const metadata: Metadata = {
  title: "Browse Novel Genres | MTL Novel Audio",
  description:
    "Explore our vast collection of novels sorted by genre. Find your next favorite audio novel by browsing through our comprehensive genre categories.",
  openGraph: {
    title: "Browse Novel Genres | MTL Novel Audio",
    description:
      "Explore our vast collection of novels sorted by genre. Find your next favorite audio novel.",
    url: `${config.siteUrl}/genres`,
    type: "website",
  },
  alternates: {
    canonical: `${config.siteUrl}/genres`,
  },
  keywords: [
    "novel genres",
    "fantasy novels",
    "romance novels",
    "sci-fi novels",
    "audio novel genres",
  ],
};

export default async function GenresPage() {
  const { genres, total } = await fetchGenres({ limit: 100 });

  // Pre-fetch data for the first genre to improve SEO
  const firstGenre = genres[0] || "";
  const initialNovelsData = firstGenre
    ? await fetchNovels({ genre: firstGenre, sort: "views", skip: 0 })
    : { novels: [], total: 0 };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Browse Novel Genres",
            description: `Find your next great read from our collection of ${total.toLocaleString()} novels across ${
              genres.length
            } genres`,
            url: `${config.siteUrl}/genres`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: genres.map((genre, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Thing",
                  name: genre,
                  url: `${config.siteUrl}/genres/${encodeURIComponent(
                    genre.toLowerCase()
                  )}`,
                },
              })),
            },
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300">
                Browse Novel Genres
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find your next great read from our collection of{" "}
              {total.toLocaleString()} novels across {genres.length} genres
            </p>
          </div>

          <Suspense fallback={<GenresLoadingSkeleton />}>
            {genres.length === 0 ? (
              <div className="text-center py-12 rounded-lg bg-gray-50 dark:bg-gray-850">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No genres available at the moment.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>Return to homepage</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            ) : (
              <ClientGenrePage
                genres={genres}
                initialGenre={firstGenre}
                initialNovels={initialNovelsData.novels || []}
                initialTotal={initialNovelsData.total}
              />
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}

function GenresLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="w-36 h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg h-12 animate-pulse"
          >
            <div className="h-full flex items-center justify-center">
              <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
