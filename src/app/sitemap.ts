import type { MetadataRoute } from "next";
import { labTools } from "@/lib/lab-tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const staticRoutes = ["/", "/about", "/projects", "/contact", "/lab"];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = labTools.map((tool) => tool.href);
  const routes = [...new Set([...staticRoutes, ...toolRoutes])];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
