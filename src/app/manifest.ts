import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iPhone Duo Wallpapers",
    short_name: "Duo Walls",
    description: "Free full-resolution wallpapers for iPhone Duo and iPhone 18 Pro.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfd",
    theme_color: "#fbfbfd",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
