import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.aeronixholidays.com";

  // Core pages
  const routes = [
    "",
    "/search",
    "/packages",
    "/offers",
    "/pricing",
    "/terms",
    "/privacy",
    "/refunds",
    "/sign-in",
    "/sign-up",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Destinations (could be fetched from DB, but for now hardcoded to match the landing page)
  const destinations = [
    "maldives",
    "kyoto",
    "amalfi-coast",
    "santorini",
    "paris",
    "dubai",
    "london",
  ].map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Flight routes (SEO routes)
  const flightRoutes = [
    "delhi-to-dubai",
    "mumbai-to-london",
    "delhi-to-bangkok",
    "bangalore-to-singapore",
    "mumbai-to-paris",
    "delhi-to-maldives",
  ].map((route) => ({
    url: `${baseUrl}/flights/${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...routes, ...destinations, ...flightRoutes];
}
