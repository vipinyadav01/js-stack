import { NextRequest, NextResponse } from "next/server";

// GET /api/github?repo=owner/repo
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get("repo");

  if (!repo) {
    return NextResponse.json({ error: "Missing 'repo' query param" }, { status: 400 });
  }

  try {
    const repoUrl = `https://api.github.com/repos/${encodeURIComponent(repo)}`;
    const releasesUrl = `https://api.github.com/repos/${encodeURIComponent(repo)}/releases?per_page=5`;
    const contributorsUrl = `https://api.github.com/repos/${encodeURIComponent(repo)}/contributors?per_page=10`;

    const headers: Record<string, string> = {
      "Accept": "application/vnd.github+json",
      "User-Agent": "nextjs-dashboard-app",
    };

    // Add GitHub token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [repoRes, releasesRes, contributorsRes] = await Promise.all([
      fetch(repoUrl, { headers, next: { revalidate: 300 } }),
      fetch(releasesUrl, { headers, next: { revalidate: 300 } }),
      fetch(contributorsUrl, { headers, next: { revalidate: 1800 } }),
    ]);

    if (!repoRes.ok) {
      throw new Error(`GitHub repo API error: ${repoRes.status}`);
    }

    const repoData = await repoRes.json();
    const releasesData = releasesRes.ok ? await releasesRes.json() : [];
    const contributorsData = contributorsRes.ok ? await contributorsRes.json() : [];

    return NextResponse.json({
      repo,
      info: {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        htmlUrl: repoData.html_url,
        stargazersCount: repoData.stargazers_count,
        watchersCount: repoData.watchers_count,
        forksCount: repoData.forks_count,
        openIssuesCount: repoData.open_issues_count,
        language: repoData.language,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,
        size: repoData.size,
        defaultBranch: repoData.default_branch,
        topics: repoData.topics || [],
        license: repoData.license,
      },
      releases: releasesData.slice(0, 5).map((release: Record<string, unknown>) => ({
        tagName: release.tag_name as string,
        name: release.name as string,
        publishedAt: release.published_at as string,
        htmlUrl: release.html_url as string,
        draft: release.draft as boolean,
        prerelease: release.prerelease as boolean,
      })),
      contributors: contributorsData.slice(0, 10).map((contributor: Record<string, unknown>) => ({
        login: contributor.login as string,
        avatarUrl: contributor.avatar_url as string,
        htmlUrl: contributor.html_url as string,
        contributions: contributor.contributions as number,
        type: contributor.type as string,
      })),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}