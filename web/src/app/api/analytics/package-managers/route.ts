import { NextResponse } from "next/server";
import { getPackageManagerStats } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export async function GET() {
  try {
    const data = await getPackageManagerStats();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Error fetching package manager stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch package manager stats" },
      { status: 500 },
    );
  }
}
