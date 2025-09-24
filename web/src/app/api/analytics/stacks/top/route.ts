import { NextResponse } from "next/server";
import { getTopStacks } from "@/lib/analytics-service";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  const data = await getTopStacks(3);
  return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } });
}


