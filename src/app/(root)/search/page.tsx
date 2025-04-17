import { SearchClient } from "@/components/search/search-client";
import { SearchResults } from "@/components/search/search-result";
import { Suspense } from "react";
import { Metadata } from "next";
import config from "@/config/data";

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

export default function SearchPage() {
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
                <SearchClient />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Suspense>
              <SearchResults />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
