// API utility functions for client-side data fetching

export interface NpmPackageData {
  package: string;
  downloads: Array<{ downloads: number; day: string }>;
  totalLast7Days: number;
  info: {
    name: string;
    description: string;
    version: string;
    versionsCount: number;
    homepage: string | null;
    repository: Record<string, unknown> | null;
    time: Record<string, string>;
  };
}


export interface GitHubRepoData {
  repo: string;
  info: {
    name: string;
    fullName: string;
    description: string;
    htmlUrl: string;
    stargazersCount: number;
    watchersCount: number;
    forksCount: number;
    openIssuesCount: number;
    language: string;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    size: number;
    defaultBranch: string;
    topics: string[];
    license: { name: string } | null;
  };
  releases: Array<{
    tagName: string;
    name: string;
    publishedAt: string;
    htmlUrl: string;
    draft: boolean;
    prerelease: boolean;
  }>;
  contributors: Array<{
    login: string;
    avatarUrl: string;
    htmlUrl: string;
    contributions: number;
    type: string;
  }>;
}

// Fetch NPM package data
export async function fetchNpmPackageData(packageName: string): Promise<NpmPackageData> {
  const periodDays = 7;
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (periodDays - 1));

  const format = (d: Date) => d.toISOString().slice(0, 10);

  const downloadsUrl = `https://api.npmjs.org/downloads/range/${format(start)}:${format(end)}/${encodeURIComponent(packageName)}`;
  const pkgInfoUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

  const [downloadsRes, infoRes] = await Promise.all([
    fetch(downloadsUrl),
    fetch(pkgInfoUrl),
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

  return {
    package: packageName,
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
  };
}

// Fetch GitHub repository data
export async function fetchGitHubRepoData(repo: string): Promise<GitHubRepoData> {
  // Sanitize repo path: replace %2F with /
  const getGithubRepoPath = (r: string) => r.replace(/%2F/g, '/');
  const repoPath = getGithubRepoPath(repo);
  const repoUrl = `https://api.github.com/repos/${repoPath}`;
  const releasesUrl = `https://api.github.com/repos/${repoPath}/releases?per_page=5`;
  const contributorsUrl = `https://api.github.com/repos/${repoPath}/contributors?per_page=10`;

  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json",
  "User-Agent": "nextjs-analytics-app",
  };

  // Add GitHub token if available (for higher rate limits)
  if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
  }

  const [repoRes, releasesRes, contributorsRes] = await Promise.all([
    fetch(repoUrl, { headers }),
    fetch(releasesUrl, { headers }),
    fetch(contributorsUrl, { headers }),
  ]);

  if (!repoRes.ok) {
    throw new Error(`GitHub repo API error: ${repoRes.status}`);
  }

  const repoData = await repoRes.json();
  const releasesData = releasesRes.ok ? await releasesRes.json() : [];
  const contributorsData = contributorsRes.ok ? await contributorsRes.json() : [];

  return {
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
  };
}
