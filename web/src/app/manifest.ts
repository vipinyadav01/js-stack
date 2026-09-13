import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JS-Stack CLI – Full-Stack Generator for JavaScript & Java",
    short_name: "JS-Stack",
    description:
      "Scaffold production-ready full-stack apps in JavaScript, TypeScript and Java: React, Next.js or Vue with Express, NestJS or Spring Boot.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#f6821f",
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
