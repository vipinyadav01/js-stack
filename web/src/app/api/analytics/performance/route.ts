import { NextResponse } from "next/server";
import { getPerformanceMetrics } from "@/lib/analytics-service";

export const dynamic = "force-static";
export const revalidate = 600;

export async function GET() {
  const data = await getPerformanceMetrics();
  return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=1200" } });
}


