import { NextResponse } from "next/server";
import { getStackTrends } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") as "7d" | "30d" | "90d") || "30d";
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
