import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JS-Stack CLI",
    short_name: "JS-Stack",
    description:
      "A powerful CLI to scaffold production-ready JavaScript/TypeScript full‑stack projects.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#3b82f6",
    icons: [],
  };
}
