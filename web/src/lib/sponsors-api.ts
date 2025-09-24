import { mockSponsorsData, mockTwitterData } from "./mock-data";

export interface Sponsor {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  tier: string;
  duration: string;
  frequency: "one-time" | "monthly" | "yearly";
  startDate: string;
  website?: string;
  github?: string;
  isActive: boolean;
}

export interface TwitterTweet {
  id: string;
  text: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
  };
  timestamp: string;
  url: string;
}

export interface SponsorAnalytics {
  totalAmount: number;
  totalSponsors: number;
  monthlyGrowth: number;
  topTier: string;
  averageAmount: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    count: number;
    timestamp: string;
  };
  error?: string;
}

// Fetch sponsor data from the API
export async function fetchSponsors(includeAnalytics: boolean = true): Promise<{
  sponsors: Sponsor[];
  analytics: SponsorAnalytics | null;
  meta?: {
    count: number;
    hasRealData: boolean;
    isFallback: boolean;
    timestamp: string;
  };
}> {
  try {
    const params = new URLSearchParams();
    if (includeAnalytics) {
      params.append("analytics", "true");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(
        `/api/sponsors?${params.toString()}` as string,
        { signal: controller.signal },
      );
      clearTimeout(timeout);
      if (!response.ok) {
        console.warn(`API returned ${response.status}, using fallback data`);
        return getFallbackSponsorsData();
      }
      const data = await response.json();
      return {
        sponsors: data.sponsors || [],
        analytics: data.analytics || null,
        meta: data.meta || null,
      };
    } catch (error) {
      clearTimeout(timeout);
      console.warn("Error fetching sponsors, using fallback data:", error);
      return getFallbackSponsorsData();
    }
  } catch (error) {
    console.warn("Unexpected error fetching sponsors:", error);
    return getFallbackSponsorsData();
  }
}

// Prefer demo (fallback) sponsors automatically when running on localhost
import { isLocalhost as isLocalEnv } from "@/lib/env";

export async function fetchSponsorsPreferDemoOnLocal(
  includeAnalytics: boolean = true,
): Promise<{
  sponsors: Sponsor[];
  analytics: SponsorAnalytics | null;
  meta?: {
    count: number;
    hasRealData: boolean;
    isFallback: boolean;
    timestamp: string;
  };
}> {
  const isLocalhost = isLocalEnv();
  try {
    const params = new URLSearchParams();
    if (includeAnalytics) {
      params.append("analytics", "true");
    }
    const response = await fetch(`/api/sponsors?${params.toString()}`);
    if (!response.ok) {
      // Prefer fallback on local; propagate error semantics by returning fallback meta
      return getFallbackSponsorsData();
    }
    const data = await response.json();
    const hasAnySponsors =
      Array.isArray(data?.sponsors) && data.sponsors.length > 0;
    if (isLocalhost && (data?.meta?.isFallback || !hasAnySponsors)) {
      return getFallbackSponsorsData();
    }
    return {
      sponsors: data.sponsors || [],
      analytics: data.analytics || null,
      meta: data.meta || null,
    };
  } catch {
    return getFallbackSponsorsData();
  }
}

// Fallback sponsors data when API is not available
function getFallbackSponsorsData(): {
  sponsors: Sponsor[];
  analytics: SponsorAnalytics | null;
  meta: {
    count: number;
    hasRealData: boolean;
    isFallback: boolean;
    timestamp: string;
  };
} {
  // Return mock data when API routes are not available
  return mockSponsorsData;
}

// Fetch Twitter mentions from the API
export async function fetchTwitterMentions(
  query: string = "js-stack",
  count: number = 20,
): Promise<{
  tweets: TwitterTweet[];
  meta?: {
    query: string;
    count: number;
    hasRealData: boolean;
    isFallback: boolean;
    timestamp: string;
  };
}> {
  try {
    const params = new URLSearchParams({
      query: query,
      count: count.toString(),
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(
        `/api/twitter?${params.toString()}` as string,
        { signal: controller.signal },
      );
      clearTimeout(timeout);
      if (!response.ok) {
        console.warn(
          `Twitter API returned ${response.status}, using fallback data`,
        );
        return getFallbackTwitterData();
      }
      const data = await response.json();
      return {
        tweets: data.tweets || [],
        meta: data.meta || null,
      };
    } catch (error) {
      clearTimeout(timeout);
      console.warn(
        "Error fetching Twitter mentions, using fallback data:",
        error,
      );
      return getFallbackTwitterData();
    }
  } catch (error) {
    console.warn("Unexpected error fetching Twitter mentions:", error);
    return getFallbackTwitterData();
  }
}

// Prefer demo (fallback) data automatically when running on localhost
export async function fetchTwitterMentionsPreferDemoOnLocal(
  query: string = "js-stack",
  count: number = 20,
): Promise<{
  tweets: TwitterTweet[];
  meta?: {
    query: string;
    count: number;
    hasRealData: boolean;
    isFallback: boolean;
    timestamp: string;
  };
}> {
  const isLocalhost = isLocalEnv();
  const result = await fetchTwitterMentions(query, count);
  if (isLocalhost && result?.meta?.isFallback) {
    return getFallbackTwitterData();
  }
  return result;
}

// Fallback Twitter data when API is not available
function getFallbackTwitterData(): {
  tweets: TwitterTweet[];
  meta: {
    query: string;
    count: number;
    hasRealData: boolean;
    isFallback: boolean;
    timestamp: string;
  };
} {
  // Return mock data when API routes are not available
  return mockTwitterData;
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format numbers for display (K, M suffixes)
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Get tier color classes for styling
export function getTierColor(tier: string): string {
  switch (tier.toLowerCase()) {
    case "platinum":
      return "border-purple-500/30 bg-purple-500/10 text-purple-600";
    case "gold":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-600";
    case "silver":
      return "border-gray-500/30 bg-gray-500/10 text-gray-600";
    case "bronze":
      return "border-orange-500/30 bg-orange-500/10 text-orange-600";
    default:
      return "border-blue-500/30 bg-blue-500/10 text-blue-600";
  }
}

// Get tier icon emoji
export function getTierIcon(tier: string): string {
  switch (tier.toLowerCase()) {
    case "platinum":
      return "💎";
    case "gold":
      return "🥇";
    case "silver":
      return "🥈";
    case "bronze":
      return "🥉";
    default:
      return "⭐";
  }
}

// Calculate time ago for timestamps
export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}

// Format time ago for Twitter timestamps (simplified format)
export function formatTimeAgo(timestamp: string): string {
  if (/^\d+[hmd]$/.test(timestamp)) {
    return timestamp;
  }

  // Otherwise, use getTimeAgo for full date strings
  return getTimeAgo(timestamp);
}

// Validate sponsor data
export function validateSponsor(sponsor: unknown): sponsor is Sponsor {
  return (
    typeof sponsor === "object" &&
    sponsor !== null &&
    typeof (sponsor as Record<string, unknown>).id === "string" &&
    typeof (sponsor as Record<string, unknown>).name === "string" &&
    typeof (sponsor as Record<string, unknown>).avatar === "string" &&
    typeof (sponsor as Record<string, unknown>).amount === "number" &&
    typeof (sponsor as Record<string, unknown>).tier === "string" &&
    typeof (sponsor as Record<string, unknown>).duration === "string" &&
    typeof (sponsor as Record<string, unknown>).frequency === "string" &&
    typeof (sponsor as Record<string, unknown>).startDate === "string" &&
    typeof (sponsor as Record<string, unknown>).isActive === "boolean"
  );
}

// Validate tweet data
export function validateTweet(tweet: unknown): tweet is TwitterTweet {
  return (
    typeof tweet === "object" &&
    tweet !== null &&
    typeof (tweet as Record<string, unknown>).id === "string" &&
    typeof (tweet as Record<string, unknown>).text === "string" &&
    typeof (tweet as Record<string, unknown>).user === "object" &&
    (tweet as Record<string, unknown>).user !== null &&
    typeof ((tweet as Record<string, unknown>).user as Record<string, unknown>)
      .name === "string" &&
    typeof ((tweet as Record<string, unknown>).user as Record<string, unknown>)
      .username === "string" &&
    typeof ((tweet as Record<string, unknown>).user as Record<string, unknown>)
      .avatar === "string" &&
    typeof (tweet as Record<string, unknown>).engagement === "object" &&
    (tweet as Record<string, unknown>).engagement !== null &&
    typeof (
      (tweet as Record<string, unknown>).engagement as Record<string, unknown>
    ).likes === "number" &&
    typeof (
      (tweet as Record<string, unknown>).engagement as Record<string, unknown>
    ).retweets === "number" &&
    typeof (
      (tweet as Record<string, unknown>).engagement as Record<string, unknown>
    ).replies === "number" &&
    typeof (tweet as Record<string, unknown>).timestamp === "string" &&
    typeof (tweet as Record<string, unknown>).url === "string"
  );
}
