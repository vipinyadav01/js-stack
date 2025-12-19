import { NextResponse } from "next/server";
import { getPerformanceMetrics } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export async function GET() {
  try {
    const data = await getPerformanceMetrics();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance metrics" },
      { status: 500 },
    );
  }
}
