import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "CUK Store",
    short_name: "CUK Store",
    description: "Buy and sell products within your campus community",

    start_url: "/",
    scope: "/",

    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0B2A5B",
    orientation: "portrait",

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}