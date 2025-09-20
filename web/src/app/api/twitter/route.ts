import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour
export const runtime = 'nodejs';

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  followers_count: number;
  following_count: number;
  description?: string;
}

export interface TwitterTweet {
  id: string;
  text: string;
  user: TwitterUser;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
    bookmarks: number;
    views?: number;
  };
  created_at: string;
  timestamp: string;
  url: string;
  reply_settings: 'everyone' | 'mentioned_users' | 'following';
  is_retweet: boolean;
  is_reply: boolean;
  media?: {
    type: 'photo' | 'video' | 'gif';
    url: string;
    alt_text?: string;
  }[];
  hashtags?: string[];
  mentions?: string[];
  urls?: {
    display_url: string;
    expanded_url: string;
  }[];
}

export interface TwitterAPIResponse {
  tweets: TwitterTweet[];
  meta: {
    query: string;
    count: number;
    hasRealData: boolean;
    isFallback: boolean;
    timestamp: string;
    next_token?: string;
    rate_limit: {
      remaining: number;
      reset_time: string;
    };
  };
}

// Helper function to generate realistic timestamps
function generateRealisticTimestamp(hoursAgo: number): { created_at: string; timestamp: string } {
  const now = new Date();
  const tweetTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
  
  return {
    created_at: tweetTime.toISOString(),
    timestamp: hoursAgo < 24 ? `${hoursAgo}h` : `${Math.floor(hoursAgo / 24)}d`
  };
}

// Enhanced mock data with realistic engagement patterns
function generateMockTweets(): TwitterTweet[] {

  
  return [
    {
      id: "1742891234567890123",
      text: "Just shipped a new feature using js-stack! The development experience is incredible - from zero to production in minutes. The TypeScript + React + Express combo with built-in Docker support is a game changer 🚀\n\n#JavaScript #FullStack #WebDev #TypeScript",
      user: {
        id: "987654321",
        name: "Sarah Chen",
        username: "sarahbuilds",
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4&eyes=default&mouth=smile",
        verified: true,
        followers_count: 15420,
        following_count: 892,
        description: "Senior Full Stack Developer @TechCorp | React, Node.js, TypeScript enthusiast | Building the future one commit at a time"
      },
      engagement: {
        likes: 247,
        retweets: 89,
        replies: 23,
        bookmarks: 156,
        views: 12847
      },
      ...generateRealisticTimestamp(3),
      url: "https://twitter.com/sarahbuilds/status/1742891234567890123",
      reply_settings: 'everyone',
      is_retweet: false,
      is_reply: false,
      hashtags: ["JavaScript", "FullStack", "WebDev", "TypeScript"],
      mentions: [],
      urls: []
    },
    {
      id: "1742789876543210987",
      text: "Been using js-stack for the past month in production. Here's what I love:\n\n✅ Zero config setup\n✅ Hot reload that actually works\n✅ Built-in testing framework\n✅ Docker integration\n✅ TypeScript out of the box\n\nThis is the future of full-stack development 💪",
      user: {
        id: "456789123",
        name: "Alex Rodriguez",
        username: "alexcodes",
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=alex&backgroundColor=ffb3ba&eyes=wink&mouth=smile",
        verified: false,
        followers_count: 8934,
        following_count: 1247,
        description: "Full Stack Engineer | Open Source Contributor | Coffee-driven development ☕"
      },
      engagement: {
        likes: 189,
        retweets: 67,
        replies: 34,
        bookmarks: 98,
        views: 8923
      },
      ...generateRealisticTimestamp(7),
      url: "https://twitter.com/alexcodes/status/1742789876543210987",
      reply_settings: 'everyone',
      is_retweet: false,
      is_reply: false,
      hashtags: [],
      mentions: [],
      urls: []
    }
  ];
}

// Simulate Twitter API rate limiting and response structure
function simulateRateLimit() {
  const resetTime = new Date();
  resetTime.setMinutes(resetTime.getMinutes() + 15);
  
  return {
    remaining: Math.floor(Math.random() * 100) + 50, // Random remaining requests
    reset_time: resetTime.toISOString()
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'js-stack';
    const count = Math.min(parseInt(searchParams.get('count') || '20'), 100);
    const nextToken = searchParams.get('next_token');

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    let realTweets: TwitterTweet[] = [];
    let hasRealData = false;

    // Try to fetch real Twitter data first
    try {
      const twitterToken = process.env.TWITTER_BEARER_TOKEN;
      
      if (twitterToken) {
        // Real Twitter API v2 implementation
        const params = new URLSearchParams({
          query: `${query} -is:retweet lang:en`,
          max_results: count.toString(),
          'tweet.fields': 'created_at,public_metrics,reply_settings,context_annotations',
          'user.fields': 'profile_image_url,verified,public_metrics,description',
          expansions: 'author_id,attachments.media_keys',
          'media.fields': 'type,url,alt_text'
        });

        if (nextToken) {
          params.append('next_token', nextToken);
        }

        const response = await fetch(
          `https://api.twitter.com/2/tweets/search/recent?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${twitterToken}`,
              'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 }
          }
        );

        if (response.ok) {
          const data = await response.json();
          realTweets = processTwitterData(data);
          hasRealData = true;
        } else {
          console.warn(`Twitter API error: ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      console.warn('Twitter API not available, using fallback data:', error);
    }

    // Use real data if available, otherwise use enhanced mock data
    const tweets = hasRealData ? realTweets : generateMockTweets();
    const filteredTweets = tweets.slice(0, count);

    const response: TwitterAPIResponse = {
      tweets: filteredTweets,
      meta: {
        query,
        count: filteredTweets.length,
        hasRealData,
        isFallback: !hasRealData,
        timestamp: new Date().toISOString(),
        next_token: hasRealData ? undefined : 'mock_next_token_123',
        rate_limit: simulateRateLimit()
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Twitter API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Twitter data',
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

// Helper function to process real Twitter API data
function processTwitterData(data: unknown): TwitterTweet[] {
  if (!data || typeof data !== 'object' || !('data' in data)) {
    return [];
  }

  const apiData = data as {
    data?: Array<{
      id: string;
      text: string;
      author_id: string;
      created_at: string;
      public_metrics?: {
        like_count: number;
        retweet_count: number;
        reply_count: number;
        quote_count: number;
        bookmark_count: number;
        impression_count: number;
      };
      attachments?: {
        media_keys?: string[];
      };
      entities?: {
        hashtags?: Array<{ tag: string }>;
        mentions?: Array<{ username: string }>;
        urls?: Array<{ url: string; expanded_url: string }>;
      };
      reply_settings?: string;
      in_reply_to_user_id?: string;
    }>;
    includes?: {
      users?: Array<{
        id: string;
        name: string;
        username: string;
        profile_image_url: string;
        verified?: boolean;
        public_metrics?: {
          followers_count: number;
          following_count: number;
          tweet_count: number;
        };
      }>;
      media?: Array<{
        media_key: string;
        type: string;
        url?: string;
        alt_text?: string;
      }>;
    };
  };

  if (!apiData.data || !Array.isArray(apiData.data)) {
    return [];
  }

  const users = apiData.includes?.users || [];
  const media = apiData.includes?.media || [];

  return apiData.data.map((tweet) => {
    const foundUser = users.find((u) => u.id === tweet.author_id);
    const user = foundUser ? {
      id: foundUser.id,
      name: foundUser.name,
      username: foundUser.username,
      profile_image_url: foundUser.profile_image_url,
      verified: foundUser.verified || false,
      public_metrics: foundUser.public_metrics || { followers_count: 0, following_count: 0, tweet_count: 0 }
    } : {
      id: 'unknown',
      name: 'Unknown User',
      username: 'unknown',
      profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
      verified: false,
      public_metrics: { followers_count: 0, following_count: 0, tweet_count: 0 }
    };
    const tweetMedia = tweet.attachments?.media_keys?.map((key: string) => 
      media.find((m) => m.media_key === key)
    ).filter((m): m is NonNullable<typeof m> => Boolean(m)) || [];

    const timeDiff = Date.now() - new Date(tweet.created_at).getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    
    return {
      id: tweet.id,
      text: tweet.text,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.profile_image_url,
        verified: user.verified,
        followers_count: user.public_metrics.followers_count,
        following_count: user.public_metrics.following_count,
        description: ''
      },
      engagement: {
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
        bookmarks: tweet.public_metrics?.bookmark_count || 0,
        views: tweet.public_metrics?.impression_count
      },
      created_at: tweet.created_at,
      timestamp: hoursAgo < 24 ? `${hoursAgo}h` : `${Math.floor(hoursAgo / 24)}d`,
      url: `https://twitter.com/${user.username}/status/${tweet.id}`,
      reply_settings: (tweet.reply_settings as 'everyone' | 'mentioned_users' | 'following') || 'everyone',
      is_retweet: false,
      is_reply: Boolean(tweet.in_reply_to_user_id),
      media: tweetMedia.map((m) => ({
        type: (m.type === 'photo' || m.type === 'video' || m.type === 'animated_gif') 
          ? (m.type === 'animated_gif' ? 'gif' : m.type) as 'photo' | 'video' | 'gif'
          : 'photo' as const,
        url: m.url || '',
        alt_text: m.alt_text || ''
      })),
      hashtags: extractHashtags(tweet.text),
      mentions: extractMentions(tweet.text),
      urls: extractUrls(tweet.text)
    };
  });
}

// Helper functions for text processing
function extractHashtags(text: string): string[] {
  const matches = text.match(/#\w+/g);
  return matches ? matches.map(tag => tag.slice(1)) : [];
}

function extractMentions(text: string): string[] {
  const matches = text.match(/@\w+/g);
  return matches ? matches.map(mention => mention.slice(1)) : [];
}

function extractUrls(text: string): { display_url: string; expanded_url: string }[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = text.match(urlRegex);
  return matches ? matches.map(url => ({
    display_url: url.length > 30 ? url.slice(0, 27) + '...' : url,
    expanded_url: url
  })) : [];
}