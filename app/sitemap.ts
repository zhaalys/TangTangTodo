import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tangtangtodo.netlify.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // Add other routes here as they become public
  ];
}
