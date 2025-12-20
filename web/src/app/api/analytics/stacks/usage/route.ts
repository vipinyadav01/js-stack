import { NextResponse } from "next/server";
import { getStackUsage } from "@/lib/analytics-service";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await getStackUsage();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching stack usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch stack usage" },
      { status: 500 },
    );
  }
}
