import { MetadataRoute } from "next";

// All course IDs from courses-data.ts
const courseIds = [
  "beginner-web-design",
  "python-fundamentals",
  "vacation-bootcamp",
  "ui-ux-design",
  "ai-for-developers",
  "wordpress-development",
  "frontend-program",
  "mern-engineering",
  "weekend-engineering",
  "kids-coding-camp",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://khodz.com";
  const now = new Date();

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Dynamic course detail pages
  const coursePages: MetadataRoute.Sitemap = courseIds.map((id) => ({
    url: `${baseUrl}/courses/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...coursePages];
}
