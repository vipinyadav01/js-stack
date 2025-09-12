import { NextRequest, NextResponse } from "next/server";

// GET /api/npm?package=name
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pkg = searchParams.get("package");

  if (!pkg) {
    return NextResponse.json({ error: "Missing 'package' query param" }, { status: 400 });
  }

  try {
    // Downloads last 7 days
    const periodDays = 7;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (periodDays - 1));

    const format = (d: Date) => d.toISOString().slice(0, 10);

    const downloadsUrl = `https://api.npmjs.org/downloads/range/${format(start)}:${format(end)}/${encodeURIComponent(pkg)}`;
    const pkgInfoUrl = `https://registry.npmjs.org/${encodeURIComponent(pkg)}`;

    const [downloadsRes, infoRes] = await Promise.all([
      fetch(downloadsUrl, { next: { revalidate: 60 } }),
      fetch(pkgInfoUrl, { next: { revalidate: 3600 } }),
    ]);

    if (!downloadsRes.ok) {
      throw new Error(`npm downloads API error: ${downloadsRes.status}`);
    }
    if (!infoRes.ok) {
      throw new Error(`npm registry API error: ${infoRes.status}`);
    }

    const downloadsData = await downloadsRes.json();
    const infoData = await infoRes.json();

    // Normalize output
    const versions = Object.keys(infoData.versions || {});
    const latest = infoData["dist-tags"]?.latest;

    return NextResponse.json({
      package: pkg,
      downloads: downloadsData.downloads || [],
      totalLast7Days: (downloadsData.downloads || []).reduce((sum: number, d: { downloads?: number }) => sum + (d.downloads || 0), 0),
      info: {
        name: infoData.name,
        description: infoData.description,
        version: latest,
        versionsCount: versions.length,
        homepage: infoData.homepage || null,
        repository: infoData.repository || null,
        time: infoData.time || {},
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
