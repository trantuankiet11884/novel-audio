import config from "@/config/data";
import { MetadataRoute } from "next";
import { fetchGenres, fetchNovels } from "@/lib/apis/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Fetch dynamic data for sitemap
  const { novels } = await fetchNovels({ limit: 1000 });
  const { genres } = await fetchGenres({ limit: 100 });

  // Static routes
  const staticRoutes = [
    {
      url: `${config.siteUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${config.siteUrl}/search`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${config.siteUrl}/genres`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${config.siteUrl}/vip`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${config.siteUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ];

  // Novel routes
  const novelRoutes = novels.map((novel) => ({
    url: `${config.siteUrl}/novel/${novel.slug}`,
    lastModified: novel.updatedAt || currentDate,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Genre routes
  const genreRoutes = genres.map((genre) => ({
    url: `${config.siteUrl}/genres/${encodeURIComponent(genre.toLowerCase())}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...novelRoutes, ...genreRoutes] as {
    url: string;
    lastModified: string | Date;
    changeFrequency?:
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "always"
      | "hourly"
      | "never";
    priority?: number;
  }[];
}
