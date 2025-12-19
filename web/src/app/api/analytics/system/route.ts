import { NextResponse } from "next/server";
import { getSystemMetrics } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export async function GET() {
  try {
    const data = await getSystemMetrics();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Error fetching system metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch system metrics" },
      { status: 500 },
    );
  }
}
