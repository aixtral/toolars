import type { MetadataRoute } from "next";
import { TOOLARS_FAVICON_URL } from "@/lib/seo/brand-icons";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Toolars — All tools. One workspace.",
    short_name: "Toolars",
    description:
      "Toolars unifies traditional calculators, AI tools, and repeatable workflows into one search-first workspace.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: TOOLARS_FAVICON_URL,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
