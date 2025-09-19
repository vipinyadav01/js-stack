import { NextRequest, NextResponse } from 'next/server';

export interface TwitterTweet {
  id: string;
  text: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
  };
  timestamp: string;
  url: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'js-stack';
    const count = parseInt(searchParams.get('count') || '20');

    // Note: In a real implementation, you would use the Twitter API v2
    // For now, we'll return mock data that matches the expected format
    
    // Mock data for demonstration
    const mockTweets: TwitterTweet[] = [
      {
        id: "1",
        text: "Just discovered js-stack! Amazing CLI tool for scaffolding full-stack apps. The TypeScript integration is seamless 🚀 #JavaScript #FullStack",
        user: {
          name: "Sarah Developer",
          username: "sarahdev",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
        },
        engagement: {
          likes: 24,
          retweets: 8,
          replies: 3
        },
        timestamp: "2 hours ago",
        url: "https://twitter.com/sarahdev/status/123456789"
      },
      {
        id: "2", 
        text: "js-stack saved me hours of setup time. The React + Express template with Docker is exactly what I needed for my startup 💪",
        user: {
          name: "Mike Startup",
          username: "mikestartup",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike"
        },
        engagement: {
          likes: 18,
          retweets: 5,
          replies: 2
        },
        timestamp: "5 hours ago",
        url: "https://twitter.com/mikestartup/status/123456788"
      },
      {
        id: "3",
        text: "The authentication templates in js-stack are incredible. JWT, Auth0, Passport - all with proper TypeScript types. This is production-ready! 🔐",
        user: {
          name: "Alex Security",
          username: "alexsecurity",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
        },
        engagement: {
          likes: 31,
          retweets: 12,
          replies: 7
        },
        timestamp: "1 day ago",
        url: "https://twitter.com/alexsecurity/status/123456787"
      },
      {
        id: "4",
        text: "Building a full-stack app with js-stack and I'm impressed by the code quality. ESLint, Prettier, TypeScript all configured perfectly! 🎯",
        user: {
          name: "Emma Coder",
          username: "emmacoder",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma"
        },
        engagement: {
          likes: 15,
          retweets: 4,
          replies: 1
        },
        timestamp: "2 days ago",
        url: "https://twitter.com/emmacoder/status/123456786"
      },
      {
        id: "5",
        text: "The database integration in js-stack is fantastic. Prisma, Sequelize, Mongoose - all the ORMs I need with proper setup! 🗄️",
        user: {
          name: "Database Dev",
          username: "dbdev",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=database"
        },
        engagement: {
          likes: 22,
          retweets: 6,
          replies: 4
        },
        timestamp: "3 days ago",
        url: "https://twitter.com/dbdev/status/123456785"
      }
    ];

    // In a real implementation, you would:
    // 1. Use Twitter API v2 with proper authentication
    // 2. Make requests to: https://api.twitter.com/2/tweets/search/recent
    // 3. Handle rate limiting and pagination
    // 4. Process and format the response data

    // Example of how you would use the real Twitter API:
    /*
    const twitterResponse = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${count}&tweet.fields=created_at,public_metrics&user.fields=profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!twitterResponse.ok) {
      throw new Error(`Twitter API error: ${twitterResponse.status}`);
    }

    const data = await twitterResponse.json();
    */

    return NextResponse.json({
      tweets: mockTweets.slice(0, count),
      meta: {
        query,
        count: mockTweets.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Twitter API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Twitter data' },
      { status: 500 }
    );
  }
}
