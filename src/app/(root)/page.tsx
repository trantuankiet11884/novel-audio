import { NovelCard } from "@/components/audio/novel-card";
import RankingNovels from "@/components/home/ranking-novels";
import NovelSlider from "@/components/novel/novel-slide";
import { fetchNovels, fetchTop10Novels } from "@/lib/apis/api";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { Metadata } from "next";
import config from "@/config/data";
import { ContinueListeningSection } from "@/components/home/continue-listening";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { BoxIcon } from "lucide-react";

// Add skeleton components
const NovelSliderSkeleton = () => (
  <div className="w-full h-[400px] bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
);

const NovelCardSkeleton = () => (
  <div className="flex flex-col animate-pulse">
    <div className="h-48 sm:h-56 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

const LatestNovelsSkeleton = () => (
  <section>
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <NovelCardSkeleton key={i} />
      ))}
    </div>
  </section>
);

const TabsSkeleton = () => (
  <div className="rounded-lg border shadow-sm p-2 bg-card animate-pulse">
    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
    <div className="space-y-3">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-5 w-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
          <div className="h-16 flex-1 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const RankingNovelsSkeleton = () => (
  <section>
    <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <NovelCardSkeleton key={i} />
      ))}
    </div>
  </section>
);

export const revalidate = 3600;

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  openGraph: {
    title: config.title,
    description: config.description,
    url: config.siteUrl,
    siteName: config.site_name,
    type: "website",
    locale: config.language,
    images: [
      {
        url: `${config.siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: config.title,
      },
    ],
  },
  alternates: {
    canonical: config.siteUrl,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  keywords: [
    "audio novels",
    "listen to novels",
    "top novels",
    "trending novels",
    "novel audio",
  ],
};

export default async function HomePage() {
  const [top10Novels, latestNovels2, rankingNovels] = await Promise.all([
    fetchTop10Novels(),
    fetchNovels({ sort: "time_new_chapter", limit: 20 }),
    fetchNovels({
      sort: "chapters",
      limit: 20,
    }),
  ]);

  const sortedLatestNovels = {
    ...latestNovels2,
    novels: [...latestNovels2.novels].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),
  };

  const tabSections = [
    {
      id: "top-10-novels",
      title: "Top 10 Novels",
      href: "/search?sort=views",
      novels: top10Novels.results[0].truyens.slice(0, 10),
    },
    {
      id: "trending-day-novels",
      title: "Trending Today",
      href: "/search?sort=views",
      novels: top10Novels.results[0].truyens.slice(0, 10),
    },
    {
      id: "trending-week-novels",
      title: "Weekly Favorites",
      href: "/search?sort=views",
      novels: top10Novels.results[2].truyens.slice(0, 10),
    },
    {
      id: "trending-month-novels",
      title: "Monthly Hits",
      href: "/search?sort=views",
      novels: top10Novels.results[1].truyens.slice(0, 10),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: config.title,
            description: config.description,
            url: config.siteUrl,
            publisher: {
              "@type": "Organization",
              name: config.title,
              logo: {
                "@type": "ImageObject",
                url: `${config.siteUrl}/images/logos/logo.svg`,
              },
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: top10Novels.results[0].truyens.map(
                (novel, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Book",
                    name: novel.title || novel.name,
                    author: novel.author,
                    url: `${config.siteUrl}/novel/${novel.slug}`,
                  },
                })
              ),
            },
          }),
        }}
      />
      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Hero section */}
        <section className="relative overflow-hidden">
          <Suspense fallback={<NovelSliderSkeleton />}>
            <NovelSlider
              sliderData={
                (await fetchNovels({ sort: "updatedAt", limit: 10 })).novels
              }
            />
          </Suspense>
        </section>

        {/* Main content with sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area - 3/4 width */}
          <div className="w-full lg:w-3/4 space-y-8">
            {/* Latest Novels Section */}
            <Suspense fallback={<LatestNovelsSkeleton />}>
              <section>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Latest Novels
                  </h2>
                  <Link
                    href="/search?sort=time_new_chapter"
                    className="flex items-center text-sm text-primary hover:underline font-medium"
                    aria-label="View all latest novels"
                  >
                    View all latest novels{" "}
                    <FaChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                {sortedLatestNovels.novels.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedLatestNovels.novels.map((novel, idx) => (
                      <NovelCard
                        key={`latest-${novel._id}-${idx}`}
                        novel={novel}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 bg-card rounded-lg border shadow-sm p-8">
                    <BoxIcon className="size-20 text-muted-foreground" />
                    <h3 className="text-2xl font-semibold text-foreground">
                      No Novels Found
                    </h3>
                    <p className="text-muted-foreground max-w-md text-sm">
                      It looks like we couldn't find any novels. Try again
                    </p>
                    <Link
                      href="/search"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      aria-label="Explore all novels"
                    >
                      Explore Novels <FaChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                )}
              </section>
            </Suspense>
            <Suspense
              fallback={
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              }
            >
              <ContinueListeningSection />
            </Suspense>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Suspense fallback={<TabsSkeleton />}>
              <div className="rounded-lg border shadow-sm p-2 bg-card">
                {/* Using Shadcn UI Tabs */}
                <Tabs defaultValue={tabSections[0].id} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4 w-full">
                    {tabSections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        className="text-xs sm:text-sm"
                      >
                        {section.title.split(" ")[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tabSections.map((section, index) => (
                    <TabsContent
                      key={`content-${section.id}`}
                      value={section.id}
                      className="mt-0"
                    >
                      <div className="flex items-center justify-between mb-3 w-full">
                        <h3 className="font-bold">{section.title}</h3>
                        <Link
                          href={section.href}
                          className="text-sm text-primary hover:underline flex items-center px-3 py-2"
                          aria-label={`View more ${section.title.toLowerCase()} sorted by views`}
                        >
                          More <FaChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {section.novels.map((novel, idx) => (
                          <div
                            key={`${section.id}-${novel._id}`}
                            className="flex items-center gap-3"
                          >
                            <span className="font-bold text-primary min-w-6 text-center">
                              {idx + 1}
                            </span>
                            <NovelCard novel={novel} variant="horizontal" />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </Suspense>
          </div>
        </div>

        {/* Renamed component from UpdatedNovels to Ranking */}
        <Suspense fallback={<RankingNovelsSkeleton />}>
          <section>
            <RankingNovels novels={rankingNovels.novels} />
          </section>
        </Suspense>
      </div>
    </>
  );
}
