import config from "@/config/data";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
      },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
  };
}
