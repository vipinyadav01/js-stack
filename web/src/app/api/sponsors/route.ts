import { NextResponse } from 'next/server';


export const revalidate = 3600; 

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

export interface SponsorAnalytics {
  totalAmount: number;
  totalSponsors: number;
  monthlyGrowth: number;
  topTier: string;
  averageAmount: number;
}

export async function GET() {
  try {
    // Static data for static export - no dynamic query params
    const includeAnalytics = false;

    // Mock data for demonstration
    // In a real implementation, you would use the GitHub Sponsors API
    const mockSponsors: Sponsor[] = [
      {
        id: "1",
        name: "Acme Corp",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=acme",
        amount: 500,
        tier: "Gold",
        duration: "6 months",
        frequency: "monthly",
        startDate: "2024-01-15",
        website: "https://acme.com",
        github: "https://github.com/acme",
        isActive: true
      },
      {
        id: "2", 
        name: "TechStart Inc",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techstart",
        amount: 200,
        tier: "Silver",
        duration: "3 months",
        frequency: "monthly",
        startDate: "2024-02-01",
        website: "https://techstart.io",
        github: "https://github.com/techstart",
        isActive: true
      },
      {
        id: "3",
        name: "DevTools LLC",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=devtools",
        amount: 100,
        tier: "Bronze",
        duration: "1 month",
        frequency: "one-time",
        startDate: "2024-03-01",
        website: "https://devtools.dev",
        isActive: true
      },
      {
        id: "4",
        name: "OpenSource Foundation",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=opensource",
        amount: 1000,
        tier: "Platinum",
        duration: "12 months",
        frequency: "yearly",
        startDate: "2024-01-01",
        website: "https://opensource.org",
        isActive: true
      },
      {
        id: "5",
        name: "EduTech Solutions",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=edutech",
        amount: 150,
        tier: "Silver",
        duration: "4 months",
        frequency: "monthly",
        startDate: "2024-02-15",
        website: "https://edutech.edu",
        isActive: true
      },
      {
        id: "6",
        name: "CloudNative Inc",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cloudnative",
        amount: 300,
        tier: "Gold",
        duration: "8 months",
        frequency: "monthly",
        startDate: "2024-01-20",
        github: "https://github.com/cloudnative",
        isActive: true
      },
      {
        id: "7",
        name: "StartupXYZ",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=startup",
        amount: 250,
        tier: "Silver",
        duration: "2 months",
        frequency: "one-time",
        startDate: "2024-03-10",
        website: "https://startupxyz.io",
        isActive: true
      },
      {
        id: "8",
        name: "Enterprise Corp",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=enterprise",
        amount: 2000,
        tier: "Platinum",
        duration: "24 months",
        frequency: "yearly",
        startDate: "2024-01-01",
        website: "https://enterprise.com",
        isActive: true
      }
    ];

    // Calculate analytics if requested
    let analytics: SponsorAnalytics | null = null;
    if (includeAnalytics) {
      const totalAmount = mockSponsors.reduce((sum, sponsor) => sum + sponsor.amount, 0);
      const totalSponsors = mockSponsors.length;
      const averageAmount = totalAmount / totalSponsors;
      
      // Find the most common tier
      const tierCounts = mockSponsors.reduce((acc, sponsor) => {
        acc[sponsor.tier] = (acc[sponsor.tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topTier = Object.entries(tierCounts).reduce((a, b) => 
        tierCounts[a[0]] > tierCounts[b[0]] ? a : b
      )[0];

      analytics = {
        totalAmount,
        totalSponsors,
        monthlyGrowth: 25, // Mock growth percentage
        topTier,
        averageAmount: Math.round(averageAmount)
      };
    }

    // In a real implementation, you would:
    // 1. Use GitHub Sponsors API with proper authentication
    // 2. Make requests to: https://api.github.com/graphql
    // 3. Use GraphQL queries to fetch sponsor data
    // 4. Handle rate limiting and pagination

    // Example of how you would use the real GitHub Sponsors API:
    /*
    const query = `
      query GetSponsors($login: String!) {
        user(login: $login) {
          sponsorshipsAsMaintainer(first: 100) {
            nodes {
              sponsor {
                login
                name
                avatarUrl
                websiteUrl
                url
              }
              tier {
                monthlyPriceInDollars
                name
              }
              createdAt
              isActive
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { login: 'vipinyadav01' }
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    */

    return NextResponse.json({
      sponsors: mockSponsors,
      analytics,
      meta: {
        count: mockSponsors.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('GitHub Sponsors API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsor data' },
      { status: 500 }
    );
  }
}
