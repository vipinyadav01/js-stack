import { NextResponse } from "next/server";
import { getGeoMetrics } from "@/lib/analytics-service";

export const revalidate = 600;

export async function GET() {
  const data = await getGeoMetrics();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=1200" },
  });
}
