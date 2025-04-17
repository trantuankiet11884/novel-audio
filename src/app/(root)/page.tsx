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

  // Chuẩn bị dữ liệu cho tabs bên phải
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
          <NovelSlider
            sliderData={
              (await fetchNovels({ sort: "updatedAt", limit: 10 })).novels
            }
          />
        </section>

        {/* Main content with sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area - 3/4 width */}
          <div className="w-full lg:w-3/4 space-y-8">
            {/* Latest Novels Section */}
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Latest Novels</h2>
                <Link
                  href="/search?sort=time_new_chapter"
                  className="flex items-center text-sm text-primary hover:underline font-medium"
                >
                  View all <FaChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedLatestNovels.novels.map((novel, idx) => (
                  <NovelCard key={`latest-${novel._id}-${idx}`} novel={novel} />
                ))}
              </div>
            </section>

            <ContinueListeningSection />
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="w-full lg:w-1/4 space-y-6">
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
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold">{section.title}</h3>
                      <Link
                        href={section.href}
                        className="text-xs text-primary hover:underline flex items-center"
                      >
                        More <FaChevronRight className="ml-1 h-2 w-2" />
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
          </div>
        </div>

        {/* Renamed component from UpdatedNovels to Ranking */}
        <section>
          <RankingNovels novels={rankingNovels.novels} />
        </section>
      </div>
    </>
  );
}
