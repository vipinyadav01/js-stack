// API Services for fetching real NPM and GitHub data

interface NPMPackageData {
  name: string;
  version: string;
  description: string;
  downloads: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
  repository?: {
    url: string;
  };
  homepage?: string;
  keywords?: string[];
  license?: string;
  maintainers?: Array<{
    name: string;
    email: string;
  }>;
  time?: {
    created: string;
    modified: string;
  };
  dist?: {
    size: number;
    unpackedSize: number;
  };
}

interface GitHubRepoData {
  name: string;
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  open_issues: number;
  language: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage?: string;
  topics?: string[];
  license?: {
    name: string;
  };
  owner: {
    login: string;
    avatar_url: string;
  };
  contributors?: Array<{
    login: string;
    contributions: number;
  }>;
  languages?: Record<string, number>;
  commits?: {
    total: number;
    weekly: number[];
  };
}

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

// NPM Registry API
export async function fetchNPMData(packageName: string): Promise<NPMPackageData | null> {
  const cacheKey = `npm:${packageName}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Fetch package metadata
    const metadataResponse = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (!metadataResponse.ok) throw new Error('Package not found');
    const metadata = await metadataResponse.json();

    // Fetch download statistics
    const downloadsResponse = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${packageName}`
    );
    const weeklyDownloads = downloadsResponse.ok ? await downloadsResponse.json() : { downloads: 0 };

    const monthlyResponse = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${packageName}`
    );
    const monthlyDownloads = monthlyResponse.ok ? await monthlyResponse.json() : { downloads: 0 };

    const yearlyResponse = await fetch(
      `https://api.npmjs.org/downloads/point/last-year/${packageName}`
    );
    const yearlyDownloads = yearlyResponse.ok ? await yearlyResponse.json() : { downloads: 0 };

    const latestVersion = metadata['dist-tags']?.latest || 'unknown';
    const versionData = metadata.versions?.[latestVersion] || {};

    const data: NPMPackageData = {
      name: metadata.name,
      version: latestVersion,
      description: metadata.description || '',
      downloads: {
        weekly: weeklyDownloads.downloads || 0,
        monthly: monthlyDownloads.downloads || 0,
        yearly: yearlyDownloads.downloads || 0,
      },
      repository: metadata.repository,
      homepage: metadata.homepage,
      keywords: metadata.keywords,
      license: metadata.license,
      maintainers: metadata.maintainers,
      time: metadata.time,
      dist: versionData.dist,
    };

    // Cache the result
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Error fetching NPM data for ${packageName}:`, error);
    return null;
  }
}

// GitHub API
export async function fetchGitHubData(repoPath: string): Promise<GitHubRepoData | null> {
  const cacheKey = `github:${repoPath}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Add GitHub token if available in environment
    const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    // Fetch repository data
    const repoResponse = await fetch(`https://api.github.com/repos/${repoPath}`, { headers });
    if (!repoResponse.ok) throw new Error('Repository not found');
    const repoData = await repoResponse.json();

    // Fetch contributors
    const contributorsResponse = await fetch(`https://api.github.com/repos/${repoPath}/contributors?per_page=10`, { headers });
    const contributors = contributorsResponse.ok ? await contributorsResponse.json() : [];

    // Fetch languages
    const languagesResponse = await fetch(`https://api.github.com/repos/${repoPath}/languages`, { headers });
    const languages = languagesResponse.ok ? await languagesResponse.json() : {};

    // Fetch commit activity
    const commitsResponse = await fetch(`https://api.github.com/repos/${repoPath}/stats/participation`, { headers });
    const commits = commitsResponse.ok ? await commitsResponse.json() : { all: [], total: 0 };

    const data: GitHubRepoData = {
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description || '',
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      watchers: repoData.watchers_count || 0,
      open_issues: repoData.open_issues_count || 0,
      language: repoData.language || 'Unknown',
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      pushed_at: repoData.pushed_at,
      homepage: repoData.homepage,
      topics: repoData.topics,
      license: repoData.license,
      owner: {
        login: repoData.owner.login,
        avatar_url: repoData.owner.avatar_url,
      },
      contributors: contributors.map((c: any) => ({
        login: c.login,
        contributions: c.contributions,
      })),
      languages,
      commits: {
        total: commits.all?.reduce((sum: number, week: number) => sum + week, 0) || 0,
        weekly: commits.all || [],
      },
    };

    // Cache the result
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Error fetching GitHub data for ${repoPath}:`, error);
    return null;
  }
}

// Fetch multiple packages in parallel
export async function fetchMultipleNPMPackages(packageNames: string[]): Promise<Record<string, NPMPackageData | null>> {
  const results = await Promise.all(
    packageNames.map(async (name) => ({
      name,
      data: await fetchNPMData(name),
    }))
  );

  return results.reduce((acc, { name, data }) => {
    acc[name] = data;
    return acc;
  }, {} as Record<string, NPMPackageData | null>);
}

// Fetch multiple GitHub repos in parallel
export async function fetchMultipleGitHubRepos(repoPaths: string[]): Promise<Record<string, GitHubRepoData | null>> {
  const results = await Promise.all(
    repoPaths.map(async (path) => ({
      path,
      data: await fetchGitHubData(path),
    }))
  );

  return results.reduce((acc, { path, data }) => {
    acc[path] = data;
    return acc;
  }, {} as Record<string, GitHubRepoData | null>);
}

// Search NPM packages
export async function searchNPMPackages(query: string, limit = 10): Promise<any[]> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=${limit}`
    );
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data.objects || [];
  } catch (error) {
    console.error('Error searching NPM packages:', error);
    return [];
  }
}

// Get trending GitHub repos
export async function getTrendingGitHubRepos(language?: string, since = 'daily'): Promise<any[]> {
  try {
    const date = new Date();
    date.setDate(date.getDate() - (since === 'weekly' ? 7 : since === 'monthly' ? 30 : 1));
    const dateString = date.toISOString().split('T')[0];

    let query = `created:>${dateString} sort:stars`;
    if (language) {
      query = `language:${language} ${query}`;
    }

    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`
    );
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching trending repos:', error);
    return [];
  }
}

// Compare packages
export async function comparePackages(packages: string[]): Promise<any> {
  const npmData = await fetchMultipleNPMPackages(packages);
  
  const comparison = {
    packages: Object.entries(npmData).map(([name, data]) => ({
      name,
      version: data?.version,
      weeklyDownloads: data?.downloads.weekly || 0,
      monthlyDownloads: data?.downloads.monthly || 0,
      size: data?.dist?.size || 0,
      unpackedSize: data?.dist?.unpackedSize || 0,
      lastModified: data?.time?.modified,
      license: data?.license,
    })),
    winner: {
      downloads: '',
      size: '',
      recentlyUpdated: '',
    },
  };

  // Determine winners
  const byDownloads = comparison.packages.sort((a, b) => b.weeklyDownloads - a.weeklyDownloads);
  const bySize = comparison.packages.sort((a, b) => a.size - b.size);
  const byRecent = comparison.packages.sort((a, b) => 
    new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()
  );

  comparison.winner.downloads = byDownloads[0]?.name || '';
  comparison.winner.size = bySize[0]?.name || '';
  comparison.winner.recentlyUpdated = byRecent[0]?.name || '';

  return comparison;
}

// Export types
export type { NPMPackageData, GitHubRepoData };
