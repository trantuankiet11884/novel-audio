import { NovelCard } from "@/components/audio/novel-card";
import UpdatedNovels from "@/components/home/updated-novels";
import { NovelSlider } from "@/components/novel/novel-slide";
import { fetchNovels, fetchTop10Novels } from "@/lib/apis/api";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { Metadata } from "next";
import config from "@/config/data";

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
  keywords: [
    "audio novels",
    "listen to novels",
    "top novels",
    "trending novels",
    "novel audio",
  ],
};

export default async function HomePage() {
  const [top10Novels, latestNovels2] = await Promise.all([
    fetchTop10Novels(),
    fetchNovels({ sort: "updatedAt", limit: 20 }),
  ]);

  const sortedLatestNovels2 = {
    ...latestNovels2,
    novels: [...latestNovels2.novels].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),
  };

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
      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero section */}
        <section className="relative rounded-xl overflow-hidden">
          <NovelSlider
            sliderData={
              (await fetchNovels({ sort: "updatedAt", limit: 10 })).novels
            }
          />
        </section>
        {/* Section Renderer */}
        {[
          {
            id: "top-10-novels",
            title: "Top 10 Novels",
            href: "/search?sort=views",
            novels: top10Novels.results[0].truyens,
            columns: "md:grid-cols-4 lg:grid-cols-5",
          },
          {
            id: "trending-day-novels",
            title: "Trending Today",
            href: "/search?sort=views",
            novels: top10Novels.results[0].truyens,
          },
          {
            id: "trending-week-novels",
            title: "Weekly Favorites",
            href: "/search?sort=views",
            novels: top10Novels.results[2].truyens,
          },
          {
            id: "trending-month-novels",
            title: "Monthly Hits",
            href: "/search?sort=views",
            novels: top10Novels.results[1].truyens,
          },
        ].map(
          ({
            id,
            title,
            href,
            novels,
            columns = "md:grid-cols-3 lg:grid-cols-6",
          }) => (
            <section key={`${id}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Link
                  href={href}
                  className="flex items-center text-sm text-primary hover:underline font-medium"
                >
                  View all <FaChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className={`grid grid-cols-2 ${columns} gap-4`}>
                {novels.map((novel, idx) => (
                  <NovelCard key={`${novel._id}-${idx}`} novel={novel} />
                ))}
              </div>
            </section>
          )
        )}

        <UpdatedNovels novels={sortedLatestNovels2.novels} />
      </div>
    </>
  );
}
