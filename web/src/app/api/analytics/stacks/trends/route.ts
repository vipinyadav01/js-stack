import { NextResponse } from "next/server";
import { getStackTrends } from "@/lib/analytics-service";

export const revalidate = 300;

export async function GET() {
  try {
    // Use default value since static export doesn't support request.url
    const range = "30d" as const;
    const data = await getStackTrends(range);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching stack trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch stack trends" },
      { status: 500 },
    );
  }
}
