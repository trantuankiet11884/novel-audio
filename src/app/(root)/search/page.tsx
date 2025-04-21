import { SearchClient } from "@/components/search/search-client";
import { SearchResults } from "@/components/search/search-result";
import { Suspense } from "react";
import { Metadata } from "next";
import config from "@/config/data";
import { fetchGenres, fetchNovels } from "@/lib/apis/api";

export const metadata: Metadata = {
  title: "Search Novels | MTL Novel Audio",
  description:
    "Find your next favorite audio novel with our advanced search filters. Browse by genre, popularity, or keywords.",
  openGraph: {
    title: "Search Novels | MTL Novel Audio",
    description:
      "Find your next favorite audio novel with our advanced search filters.",
    url: `${config.siteUrl}/search`,
    type: "website",
  },
  alternates: {
    canonical: `${config.siteUrl}/search`,
  },
  keywords: [
    "novel search",
    "audio novel search",
    "find novels",
    "novel database",
    "search by genre",
  ],
};

// Define type for search params
type SearchParamsType = { [key: string]: string | string[] | undefined };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  // Resolve search params (always a Promise in dynamic pages)
  const resolvedParams = await searchParams;

  // Extract search parameters from resolved params
  const keyword =
    typeof resolvedParams.keyword === "string" ? resolvedParams.keyword : "";
  const genre =
    typeof resolvedParams.genre === "string" ? resolvedParams.genre : "";
  const status =
    typeof resolvedParams.status === "string" ? resolvedParams.status : "";
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "views";
  const chapters =
    typeof resolvedParams.chapters === "string" ? resolvedParams.chapters : "";
  const page =
    typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;

  // Pre-fetch data for initial server-side rendering
  const { genres } = await fetchGenres({ limit: 100 });

  // Fetch initial search results on the server
  const limit = 18;
  const skip = (page - 1) * limit;
  const initialSearchResults = await fetchNovels({
    keyword,
    genre: genre === "all" ? "" : genre,
    sort,
    status,
    chapters,
    limit,
    skip,
    page,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Search Novels",
            description:
              "Find your next favorite audio novel with our advanced search filters.",
            url: `${config.siteUrl}/search`,
            mainEntity: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${config.siteUrl}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
              description:
                "Search for audio novels by title, author, genre or keywords",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: config.siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Search",
                  item: `${config.siteUrl}/search`,
                },
              ],
            },
          }),
        }}
      />

      {initialSearchResults.novels &&
        initialSearchResults.novels.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: initialSearchResults.novels.map(
                  (novel: any, index: number) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                      "@type": "Book",
                      name: novel.title,
                      author: {
                        "@type": "Person",
                        name: novel.author || "Unknown Author",
                      },
                      url: `${config.siteUrl}/novel/${novel.slug}`,
                      numberOfPages: novel.chapters || 0,
                      genre: novel.genres?.join(", ") || "",
                    },
                  })
                ),
              }),
            }}
          />
        )}

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Search Novels</h1>
          <p className="text-muted-foreground mt-2">
            Find your next favorite novel using the filters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Suspense>
                <SearchClient
                  initialGenres={genres}
                  initialKeyword={keyword}
                  initialGenre={genre}
                  initialSort={sort}
                  initialStatus={status}
                  initialChapters={chapters}
                />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Suspense>
              <SearchResults
                initialResults={initialSearchResults.novels || []}
                initialTotal={initialSearchResults.total || 0}
                initialHasNext={initialSearchResults.hasNext || false}
                initialHasPrev={initialSearchResults.hasPrev || false}
                initialTotalPages={initialSearchResults.totalPages || 0}
                initialPage={page}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
