import { NextResponse } from "next/server";
import { getKPIs } from "@/lib/analytics-service";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await getKPIs();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return NextResponse.json(
      { error: "Failed to fetch KPIs" },
      { status: 500 },
    );
  }
}
