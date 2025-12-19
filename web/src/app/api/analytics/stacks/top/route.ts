import { NextResponse } from "next/server";
import { getTopStacks } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const n = parseInt(searchParams.get("n") || "3", 10);
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
