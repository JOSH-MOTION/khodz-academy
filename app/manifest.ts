import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khodz Academy",
    short_name: "Khodz",
    description: "High Performance Learning Management System for coders",
    start_url: "/",
    display: "standalone",
    background_color: "#010d1a",
    theme_color: "#36ECDF",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/khodz-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/khodz-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
