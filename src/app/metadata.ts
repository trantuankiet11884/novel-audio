import config from "@/config/data";
import { Metadata } from "next";

export const metadataBase = new URL(config.siteUrl);

export const defaultMetadata: Metadata = {
  title: {
    default: config.title,
    template: `%s | ${config.title}`,
  },
  description: config.description,
  authors: [{ name: config.author }],
  metadataBase,
  openGraph: {
    title: config.title,
    description: config.description,
    url: config.siteUrl,
    siteName: config.site_name,
    type: "website",
    locale: config.language,
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: config.siteUrl,
  },
};
