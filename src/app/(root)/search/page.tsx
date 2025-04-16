import SearchClient from "@/components/search/search-client";
import { fetchGenres, fetchNovels } from "@/lib/apis/api";
import { Metadata } from "next";
import config from "@/config/data";

// Revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Search Novels | MTL Novel Audio",
  description:
    "Search through our extensive library of audio novels. Filter by genres, ratings, and more to find your perfect listen.",
  openGraph: {
    title: "Search Novels | MTL Novel Audio",
    description:
      "Search through our extensive library of audio novels. Filter by genres, ratings, and more.",
    url: `${config.siteUrl}/search`,
    type: "website",
  },
  alternates: {
    canonical: `${config.siteUrl}/search`,
  },
  keywords: [
    "novel search",
    "find novels",
    "audio novel search",
    "filter novels",
    "browse novels",
  ],
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; genre?: string; sort?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 20;
  const skip = (page - 1) * limit;
  const genre = searchParams.genre || "";
  const sort = searchParams.sort || "views";

  const { novels, total } = await fetchNovels({
    genre,
    sort,
    limit,
    skip,
  });
  const { genres } = await fetchGenres({ limit: 100 });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            name: "Novel Search Results",
            description: `Search results for ${
              sort ? `"${sort}"` : "all novels"
            }${genre ? ` in ${genre} genre` : ""}`,
            url: `${config.siteUrl}/search${
              searchParams.sort
                ? `?${new URLSearchParams(
                    searchParams.sort as unknown as Record<string, string>
                  ).toString()}`
                : ""
            }`,
          }),
        }}
      />
      <SearchClient
        initialNovels={novels}
        totalNovels={total}
        genres={genres}
        currentPage={page}
        novelsPerPage={limit}
      />
    </>
  );
}
