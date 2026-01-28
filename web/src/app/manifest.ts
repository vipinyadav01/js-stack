import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JS-Stack CLI - JavaScript Project Generator",
    short_name: "JS-Stack",
    description:
      "A powerful CLI to scaffold production-ready JavaScript/TypeScript full‑stack projects with Next.js, React, Node.js, and modern development best practices.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    categories: ["development", "productivity", "utilities"],
    icons: [
      {
        src: "/web-app-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
