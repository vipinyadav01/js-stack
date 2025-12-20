import { NextResponse } from "next/server";
import { getTopStacks } from "@/lib/analytics-service";

export const revalidate = 300;

export async function GET() {
  try {
    // Use default value since static export doesn't support request.url
    const n = 6;
    const data = await getTopStacks(n);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching top stacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch top stacks" },
      { status: 500 },
    );
  }
}
