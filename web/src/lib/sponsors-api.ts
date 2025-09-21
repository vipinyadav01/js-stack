// Sponsor-related API utility functions

export interface Sponsor {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  tier: string;
  duration: string;
  frequency: 'one-time' | 'monthly' | 'yearly';
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
      params.append('analytics', 'true');
    }

    const response = await fetch(`/api/sponsors?${params.toString()}`);
    
    if (!response.ok) {
      console.warn(`API returned ${response.status}, using fallback data`);
      return getFallbackSponsorsData();
    }

    const data = await response.json();
    
    return {
      sponsors: data.sponsors || [],
      analytics: data.analytics || null,
      meta: data.meta || null
    };
  } catch (error) {
    console.warn('Error fetching sponsors, using fallback data:', error);
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
  const fallbackSponsors: Sponsor[] = [
    {
      id: "fallback-1",
      name: "Sample Sponsor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sample1",
      amount: 100,
      tier: "Bronze",
      duration: "1 month",
      frequency: "one-time",
      startDate: "2024-01-01",
      website: "https://example.com",
      github: "https://github.com/sample1",
      isActive: true
    },
    {
      id: "fallback-2",
      name: "Demo Company",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      amount: 250,
      tier: "Silver",
      duration: "3 months",
      frequency: "monthly",
      startDate: "2024-02-01",
      website: "https://demo.com",
      github: "https://github.com/demo",
      isActive: true
    }
  ];

  return {
    sponsors: fallbackSponsors,
    analytics: {
      totalAmount: fallbackSponsors.reduce((sum, sponsor) => sum + sponsor.amount, 0),
      totalSponsors: fallbackSponsors.length,
      monthlyGrowth: 0,
      topTier: fallbackSponsors.length > 0 ? fallbackSponsors[0].tier : 'none',
      averageAmount: fallbackSponsors.length > 0 
        ? Math.round(fallbackSponsors.reduce((sum, sponsor) => sum + sponsor.amount, 0) / fallbackSponsors.length)
        : 0
    },
    meta: {
      count: fallbackSponsors.length,
      hasRealData: false,
      isFallback: true,
      timestamp: new Date().toISOString()
    }
  };
}

// Fetch Twitter mentions from the API
export async function fetchTwitterMentions(query: string = 'js-stack', count: number = 20): Promise<{
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
      count: count.toString()
    });

    const response = await fetch(`/api/twitter?${params.toString()}`);
    
    if (!response.ok) {
      console.warn(`Twitter API returned ${response.status}, using fallback data`);
      return getFallbackTwitterData();
    }

    const data = await response.json();
    
    return {
      tweets: data.tweets || [],
      meta: data.meta || null
    };
  } catch (error) {
    console.warn('Error fetching Twitter mentions, using fallback data:', error);
    return getFallbackTwitterData();
  }
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
  const fallbackTweets: TwitterTweet[] = [
    {
      id: "fallback-1",
      text: "Just discovered js-stack! Amazing CLI tool for scaffolding full-stack apps. The TypeScript integration is seamless 🚀 #JavaScript #FullStack",
      user: {
        name: "Sample User",
        username: "sampleuser",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sample1",
        verified: false
      },
      engagement: {
        likes: 5,
        retweets: 2,
        replies: 1
      },
      timestamp: "2h",
      url: "https://twitter.com/sampleuser/status/123456789"
    },
    {
      id: "fallback-2", 
      text: "js-stack saved me hours of setup time. The React + Express template with Docker is exactly what I needed for my project 💪",
      user: {
        name: "Demo Developer",
        username: "demodev",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        verified: false
      },
      engagement: {
        likes: 8,
        retweets: 3,
        replies: 2
      },
      timestamp: "5h",
      url: "https://twitter.com/demodev/status/123456788"
    }
  ];

  return {
    tweets: fallbackTweets,
    meta: {
      query: "js-stack",
      count: fallbackTweets.length,
      hasRealData: false,
      isFallback: true,
      timestamp: new Date().toISOString()
    }
  };
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
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
    case 'platinum':
      return 'border-purple-500/30 bg-purple-500/10 text-purple-600';
    case 'gold':
      return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600';
    case 'silver':
      return 'border-gray-500/30 bg-gray-500/10 text-gray-600';
    case 'bronze':
      return 'border-orange-500/30 bg-orange-500/10 text-orange-600';
    default:
      return 'border-blue-500/30 bg-blue-500/10 text-blue-600';
  }
}

// Get tier icon emoji
export function getTierIcon(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'platinum':
      return '💎';
    case 'gold':
      return '🥇';
    case 'silver':
      return '🥈';
    case 'bronze':
      return '🥉';
    default:
      return '⭐';
  }
}

// Calculate time ago for timestamps
export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}

// Format time ago for Twitter timestamps (simplified format)
export function formatTimeAgo(timestamp: string): string {
  // If timestamp is already in short format (like "2h", "5h"), return as is
  if (/^\d+[hmd]$/.test(timestamp)) {
    return timestamp;
  }
  
  // Otherwise, use getTimeAgo for full date strings
  return getTimeAgo(timestamp);
}

// Validate sponsor data
export function validateSponsor(sponsor: unknown): sponsor is Sponsor {
  return (
    typeof sponsor === 'object' &&
    sponsor !== null &&
    typeof (sponsor as Record<string, unknown>).id === 'string' &&
    typeof (sponsor as Record<string, unknown>).name === 'string' &&
    typeof (sponsor as Record<string, unknown>).avatar === 'string' &&
    typeof (sponsor as Record<string, unknown>).amount === 'number' &&
    typeof (sponsor as Record<string, unknown>).tier === 'string' &&
    typeof (sponsor as Record<string, unknown>).duration === 'string' &&
    typeof (sponsor as Record<string, unknown>).frequency === 'string' &&
    typeof (sponsor as Record<string, unknown>).startDate === 'string' &&
    typeof (sponsor as Record<string, unknown>).isActive === 'boolean'
  );
}

// Validate tweet data
export function validateTweet(tweet: unknown): tweet is TwitterTweet {
  return (
    typeof tweet === 'object' &&
    tweet !== null &&
    typeof (tweet as Record<string, unknown>).id === 'string' &&
    typeof (tweet as Record<string, unknown>).text === 'string' &&
    typeof (tweet as Record<string, unknown>).user === 'object' &&
    (tweet as Record<string, unknown>).user !== null &&
    typeof ((tweet as Record<string, unknown>).user as Record<string, unknown>).name === 'string' &&
    typeof ((tweet as Record<string, unknown>).user as Record<string, unknown>).username === 'string' &&
    typeof ((tweet as Record<string, unknown>).user as Record<string, unknown>).avatar === 'string' &&
    typeof (tweet as Record<string, unknown>).engagement === 'object' &&
    (tweet as Record<string, unknown>).engagement !== null &&
    typeof ((tweet as Record<string, unknown>).engagement as Record<string, unknown>).likes === 'number' &&
    typeof ((tweet as Record<string, unknown>).engagement as Record<string, unknown>).retweets === 'number' &&
    typeof ((tweet as Record<string, unknown>).engagement as Record<string, unknown>).replies === 'number' &&
    typeof (tweet as Record<string, unknown>).timestamp === 'string' &&
    typeof (tweet as Record<string, unknown>).url === 'string'
  );
}
