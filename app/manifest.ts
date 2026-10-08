import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Paramount Laundry",
    short_name: "Paramount",
    description: "Laundry & dry cleaning pickup and delivery in Lagos.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F9",
    theme_color: "#0D1B2A",
    icons: [
      { src: "/brand/paramount-laundry-icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
