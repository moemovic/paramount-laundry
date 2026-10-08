import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Kept to the core sitemap fields (loc, lastmod, changefreq, priority) so it
// validates strictly against the sitemaps.org schema that Google reads.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
