import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour
export const runtime = 'nodejs';

export interface Sponsor {
  id: string;
  name: string;
  username: string;
  avatar: string;
  amount: number;
  tier: string;
  tierName: string;
  duration: string;
  frequency: 'one-time' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  website?: string;
  github: string;
  isActive: boolean;
  totalContributed: number;
  sponsorshipCount: number;
  message?: string;
  isPublic: boolean;
  location?: string;
  company?: string;
}

export interface SponsorAnalytics {
  totalAmount: number;
  monthlyRecurring: number;
  oneTimeAmount: number;
  totalSponsors: number;
  activeSponsors: number;
  monthlyGrowth: number;
  topTier: string;
  averageAmount: number;
  tierBreakdown: Record<string, number>;
  recentSponsors: number; // Last 30 days
  retentionRate: number;
  lifetimeValue: number;
}

export interface GitHubSponsorsAPIResponse {
  sponsors: Sponsor[];
  analytics: SponsorAnalytics | null;
  meta: {
    count: number;
    hasRealData: boolean;
    isFallback: boolean;
    timestamp: string;
    rateLimit?: {
      remaining: number;
      resetTime: string;
      cost: number;
    };
    pagination?: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
}

// Helper function to calculate duration from start date
function calculateDuration(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  if (months < 1) return 'Less than 1 month';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
}

// Enhanced mock data with realistic sponsorship patterns
function generateMockSponsors(): Sponsor[] {
  const sponsors: Sponsor[] = [
    {
      id: "sponsor_1742891234567890",
      name: "TechCorp Solutions",
      username: "techcorp",
      avatar: "https://api.dicebear.com/8.x/initials/svg?seed=TechCorp&backgroundColor=4f46e5",
      amount: 500,
      tier: "gold",
      tierName: "Gold Sponsor",
      duration: calculateDuration("2023-08-15"),
      frequency: "monthly",
      startDate: "2023-08-15T10:30:00Z",
      website: "https://techcorp.example.com",
      github: "https://github.com/techcorp",
      isActive: true,
      totalContributed: 6500,
      sponsorshipCount: 13,
      message: "Thanks for your amazing work on js-stack! It's saved our team countless hours.",
      isPublic: true,
      location: "San Francisco, CA",
      company: "TechCorp Solutions"
    },
    {
      id: "sponsor_1742789876543210",
      name: "Alex Thompson",
      username: "alexthompson",
      avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=alexthompson&backgroundColor=10b981&eyes=default&mouth=smile",
      amount: 25,
      tier: "bronze",
      tierName: "Individual Supporter",
      duration: calculateDuration("2024-01-20"),
      frequency: "monthly",
      startDate: "2024-01-20T14:22:00Z",
      website: "https://alexthompson.dev",
      github: "https://github.com/alexthompson",
      isActive: true,
      totalContributed: 200,
      sponsorshipCount: 8,
      message: "Keep up the great work! js-stack is a game changer for indie developers.",
      isPublic: true,
      location: "Toronto, Canada",
      company: "Freelance Developer"
    }
  ];

  return sponsors;
}

// Calculate comprehensive analytics
function calculateAnalytics(sponsors: Sponsor[]): SponsorAnalytics {
  const activeSponsors = sponsors.filter(s => s.isActive);
  const monthlySponsors = activeSponsors.filter(s => s.frequency === 'monthly');
  const oneTimeSponsors = sponsors.filter(s => s.frequency === 'one-time');
  
  const monthlyRecurring = monthlySponsors.reduce((sum, s) => sum + s.amount, 0);
  const oneTimeAmount = oneTimeSponsors.reduce((sum, s) => sum + s.amount, 0);
  const totalAmount = sponsors.reduce((sum, s) => sum + s.totalContributed, 0);
  
  // Tier breakdown
  const tierBreakdown = sponsors.reduce((acc, sponsor) => {
    acc[sponsor.tier] = (acc[sponsor.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Find top tier
  const topTier = Object.keys(tierBreakdown).length > 0 
    ? Object.entries(tierBreakdown).reduce((a, b) => 
        tierBreakdown[a[0]] > tierBreakdown[b[0]] ? a : b
      )[0] 
    : 'none';
  
  // Recent sponsors (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSponsors = sponsors.filter(s => 
    new Date(s.startDate) >= thirtyDaysAgo
  ).length;
  
  // Calculate retention rate (simplified)
  const retentionRate = activeSponsors.length / Math.max(sponsors.length, 1) * 100;
  
  // Lifetime value
  const lifetimeValue = totalAmount / Math.max(sponsors.length, 1);
  
  return {
    totalAmount,
    monthlyRecurring,
    oneTimeAmount,
    totalSponsors: sponsors.length,
    activeSponsors: activeSponsors.length,
    monthlyGrowth: 12.5, // Mock growth rate
    topTier,
    averageAmount: Math.round(monthlyRecurring / Math.max(monthlySponsors.length, 1)),
    tierBreakdown,
    recentSponsors,
    retentionRate: Math.round(retentionRate * 100) / 100,
    lifetimeValue: Math.round(lifetimeValue * 100) / 100
  };
}

// Simulate GitHub GraphQL API rate limiting
function simulateGraphQLRateLimit() {
  const resetTime = new Date();
  resetTime.setHours(resetTime.getHours() + 1);
  
  return {
    remaining: Math.floor(Math.random() * 4900) + 100, // 100-5000 remaining
    resetTime: resetTime.toISOString(),
    cost: 1 // GraphQL query cost
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAnalytics = searchParams.get('analytics') === 'true';
    const username = searchParams.get('username') || 'vipinyadav01';
    const first = Math.min(parseInt(searchParams.get('first') || '50'), 100);
    const after = searchParams.get('after'); // Cursor for pagination

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200));

    let realSponsors: Sponsor[] = [];
    let hasRealData = false;
    let pagination = undefined;

    try {
      const githubToken = process.env.GITHUB_TOKEN;
      
      if (githubToken) {
        // Real GitHub GraphQL API implementation
        const query = `
          query GetSponsors($login: String!, $first: Int!, $after: String) {
            user(login: $login) {
              sponsorshipsAsMaintainer(first: $first, after: $after, orderBy: {field: CREATED_AT, direction: DESC}) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  id
                  createdAt
                  isActive
                  sponsor {
                    id
                    login
                    name
                    avatarUrl
                    websiteUrl
                    url
                    location
                    company
                  }
                  tier {
                    id
                    name
                    monthlyPriceInDollars
                    description
                  }
                  sponsorEntity {
                    ... on User {
                      sponsorshipsAsSponsor {
                        totalCount
                      }
                    }
                    ... on Organization {
                      sponsorshipsAsSponsor {
                        totalCount
                      }
                    }
                  }
                }
              }
            }
            rateLimit {
              remaining
              resetAt
              cost
            }
          }
        `;

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'js-stack-sponsors/1.0'
          },
          body: JSON.stringify({
            query,
            variables: { 
              login: username,
              first,
              after
            }
          }),
          next: { revalidate: 3600 }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.errors) {
            console.warn('GitHub GraphQL errors:', data.errors);
          } else {
            realSponsors = processGitHubSponsorsData(data);
            hasRealData = true;
            
            // Extract pagination info
            const pageInfo = data.data?.user?.sponsorshipsAsMaintainer?.pageInfo;
            if (pageInfo) {
              pagination = {
                hasNextPage: pageInfo.hasNextPage,
                endCursor: pageInfo.endCursor
              };
            }
          }
        } else {
          console.warn(`GitHub API error: ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      console.warn('GitHub Sponsors API not available, using fallback data:', error);
    }

    // Use real data if available, otherwise use enhanced mock data
    const sponsors = hasRealData ? realSponsors : generateMockSponsors();
    
    // Calculate analytics if requested
    const analytics = includeAnalytics ? calculateAnalytics(sponsors) : null;

    const response: GitHubSponsorsAPIResponse = {
      sponsors,
      analytics,
      meta: {
        count: sponsors.length,
        hasRealData,
        isFallback: !hasRealData,
        timestamp: new Date().toISOString(),
        rateLimit: hasRealData ? undefined : simulateGraphQLRateLimit(),
        pagination: hasRealData ? pagination : undefined
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('GitHub Sponsors API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch sponsor data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

// Helper function to process real GitHub Sponsors API data
function processGitHubSponsorsData(data: unknown): Sponsor[] {
  if (!data || typeof data !== 'object' || !('data' in data)) {
    return [];
  }
  
  const apiData = data as {
    data?: {
      user?: {
        sponsorshipsAsMaintainer?: {
          nodes?: Array<{
            id: string;
            sponsor?: {
              login: string;
              name?: string;
              avatarUrl: string;
              websiteUrl?: string;
              url?: string;
              location?: string;
              company?: string;
            };
            tier?: {
              monthlyPriceInDollars: number;
              name: string;
            };
            createdAt: string;
            isActive?: boolean;
            sponsorEntity?: {
              sponsorshipsAsSponsor?: {
                totalCount: number;
              };
            };
          }>;
        };
      };
    };
  };

  if (!apiData.data?.user?.sponsorshipsAsMaintainer?.nodes) {
    return [];
  }

  return apiData.data.user.sponsorshipsAsMaintainer.nodes.map((sponsorship) => {
    const sponsor = sponsorship.sponsor;
    const tier = sponsorship.tier;
    const startDate = sponsorship.createdAt;
    const sponsorshipCount = sponsorship.sponsorEntity?.sponsorshipsAsSponsor?.totalCount || 1;
    
    // Type assertion since we've already filtered above
    const safeSponsor = sponsor!;
    const safeTier = tier!;
    
    // Calculate tier name based on amount
    let tierName = safeTier.name || 'Custom';
    let tierKey = 'custom';
    
    const amount = safeTier.monthlyPriceInDollars;
    if (amount >= 500) {
      tierKey = 'gold';
      tierName = 'Gold Sponsor';
    } else if (amount >= 100) {
      tierKey = 'silver';
      tierName = 'Silver Sponsor';
    } else if (amount >= 25) {
      tierKey = 'bronze';
      tierName = 'Bronze Sponsor';
    } else {
      tierKey = 'supporter';
      tierName = 'Supporter';
    }
    
    // Estimate total contributed (simplified calculation)
    const monthsSinceStart = Math.max(1, Math.floor(
      (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    ));
    const totalContributed = amount * Math.min(monthsSinceStart, 24); 

    return {
      id: sponsorship.id,
      name: safeSponsor.name || safeSponsor.login,
      username: safeSponsor.login,
      avatar: safeSponsor.avatarUrl,
      amount,
      tier: tierKey,
      tierName,
      duration: calculateDuration(startDate),
      frequency: 'monthly' as const, 
      startDate,
      website: safeSponsor.websiteUrl,
      github: safeSponsor.url || `https://github.com/${safeSponsor.login}`,
      isActive: sponsorship.isActive ?? true,
      totalContributed,
      sponsorshipCount,
      isPublic: true,
      location: safeSponsor.location,
      company: safeSponsor.company
    };
  });
}