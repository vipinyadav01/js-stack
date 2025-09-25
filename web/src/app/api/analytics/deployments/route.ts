import { NextResponse } from "next/server";
import { getDeploymentAnalytics } from "@/lib/analytics-service";

export const dynamic = "force-static";
export const revalidate = 600;

export async function GET() {
  const data = await getDeploymentAnalytics();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=1200" },
  });
}
