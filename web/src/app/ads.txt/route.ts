import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const adsTxt = `# ads.txt file for JS-Stack CLI
# This file is used for ad verification and monetization
# Add your ad network entries below when applicable

# Example format:
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0

# For now, this file is empty as the project is open source
# Add ad network entries here when needed
`;

  return new NextResponse(adsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
