import { NextResponse } from "next/server";
import { getStackTrends } from "@/lib/analytics-service";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  const data = await getStackTrends("30d");
  return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } });
}


