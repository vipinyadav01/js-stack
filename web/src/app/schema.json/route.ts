import { NextResponse } from "next/server";
import { buildSiteSchema } from "@/lib/site-schema";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  return NextResponse.json(buildSiteSchema(), {
    headers: {
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
