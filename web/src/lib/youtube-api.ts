export interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  channelTitle: string;
  viewCount: string;
  likeCount: string;
  tags: string[];
  url: string;
}

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  channelTitle: string;
  viewCount: string;
  likeCount: string;
  tags: string[];
}

// Extract YouTube video ID from various URL formats
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    // youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    // youtu.be/VIDEO_ID (with or without parameters)
    /(?:youtu\.be\/)([^&\n?#]+)/,
    // youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    // youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    // youtube.com/watch?other_params&v=VIDEO_ID
    /(?:youtube\.com\/watch\?.*[?&]v=)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Format duration from ISO 8601 format (PT15M30S) to readable format (15:30)
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Format view count (e.g., 1234567 -> 1.2M)
export function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// Get video thumbnail URL
export function getVideoThumbnail(
  videoId: string,
  quality: "default" | "medium" | "high" | "standard" | "maxres" = "maxres",
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

// Get video embed URL
export function getVideoEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
}

// Get video watch URL
export function getVideoWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// Check if running on localhost
export function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0" ||
    window.location.hostname.includes("localhost")
  );
}

// Fetch basic video data using YouTube oEmbed (no API key required)
export async function fetchYouTubeVideoDataOEmbed(
  videoUrl: string,
): Promise<YouTubeVideoData | null> {
  try {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Use YouTube oEmbed API (no API key required)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
    const response = await fetch(oEmbedUrl);

    if (!response.ok) {
      throw new Error(`oEmbed API error: ${response.status}`);
    }

    const oEmbedData = await response.json();

    // oEmbed provides basic info, we'll supplement with what we can get
    return {
      id: videoId,
      title: oEmbedData.title || "YouTube Video",
      description: oEmbedData.description || "No description available",
      thumbnail: oEmbedData.thumbnail_url || getVideoThumbnail(videoId),
      duration: "Unknown", // oEmbed doesn't provide duration
      publishedAt: new Date().toISOString(), // oEmbed doesn't provide publish date
      channelTitle: oEmbedData.author_name || "Unknown Channel",
      viewCount: "Unknown", // oEmbed doesn't provide view count
      likeCount: "Unknown", // oEmbed doesn't provide like count
      tags: [], // oEmbed doesn't provide tags
      url: videoUrl,
    };
  } catch (error) {
    console.error("Error fetching YouTube oEmbed data:", error);
    return null;
  }
}

// Demo video data for localhost development
export function getDemoVideoData(videoId: string): YouTubeVideoInfo {
  const demoData = {
    Ihf16CL0z7I: {
      videoId: "Ihf16CL0z7I",
      title: "JS-Stack Complete Tutorial - Build Full-Stack Apps",
      description:
        "Learn how to build modern full-stack JavaScript applications using JS-Stack. This comprehensive tutorial covers everything from setup to deployment.",
      thumbnail: "https://img.youtube.com/vi/Ihf16CL0z7I/maxresdefault.jpg",
      duration: "PT18M45S",
      publishedAt: "2024-01-20T14:30:00Z",
      channelTitle: "JS-Stack Tutorials",
      viewCount: "150000",
      likeCount: "4200",
      tags: [
        "js-stack",
        "tutorial",
        "fullstack",
        "javascript",
        "react",
        "nodejs",
      ],
    },
    dQw4w9WgXcQ: {
      videoId: "dQw4w9WgXcQ",
      title: "Complete JS-Stack Setup Tutorial",
      description:
        "Learn how to set up a full-stack JavaScript application using JS-Stack from scratch. This comprehensive tutorial covers everything from installation to deployment.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "PT15M30S",
      publishedAt: "2024-01-15T10:00:00Z",
      channelTitle: "JS-Stack Tutorials",
      viewCount: "125000",
      likeCount: "3200",
      tags: ["js-stack", "tutorial", "setup", "javascript", "fullstack"],
    },
    abc123def456: {
      videoId: "abc123def456",
      title: "Building a Modern Web App with JS-Stack",
      description:
        "Watch how to build a complete modern web application using JS-Stack's powerful CLI and template system. Perfect for intermediate developers.",
      thumbnail: "https://img.youtube.com/vi/abc123def456/maxresdefault.jpg",
      duration: "PT22M45S",
      publishedAt: "2024-02-10T14:30:00Z",
      channelTitle: "JS-Stack Tutorials",
      viewCount: "89000",
      likeCount: "2100",
      tags: ["js-stack", "webapp", "demo", "react", "express"],
    },
    xyz789uvw012: {
      videoId: "xyz789uvw012",
      title: "Advanced JS-Stack Features & Customization",
      description:
        "Explore advanced features of JS-Stack including custom templates, plugin development, and deployment strategies for production applications.",
      thumbnail: "https://img.youtube.com/vi/xyz789uvw012/maxresdefault.jpg",
      duration: "PT18M20S",
      publishedAt: "2024-03-05T09:15:00Z",
      channelTitle: "JS-Stack Tutorials",
      viewCount: "67000",
      likeCount: "1800",
      tags: ["js-stack", "advanced", "customization", "plugins", "deployment"],
    },
    def456ghi789: {
      videoId: "def456ghi789",
      title: "JS-Stack CLI Deep Dive",
      description:
        "Master the JS-Stack CLI with this in-depth tutorial covering all commands, options, and best practices for efficient development.",
      thumbnail: "https://img.youtube.com/vi/def456ghi789/maxresdefault.jpg",
      duration: "PT12M15S",
      publishedAt: "2024-03-20T16:45:00Z",
      channelTitle: "JS-Stack Tutorials",
      viewCount: "45000",
      likeCount: "1200",
      tags: ["js-stack", "cli", "commands", "productivity", "tools"],
    },
  };

  return (
    demoData[videoId as keyof typeof demoData] || {
      videoId,
      title: "JS-Stack Tutorial Video",
      description:
        "This is a demo video for JS-Stack tutorial. In production, this would show the actual video data from YouTube.",
      thumbnail: getVideoThumbnail(videoId),
      duration: "PT10M30S",
      publishedAt: new Date().toISOString(),
      channelTitle: "JS-Stack Tutorials",
      viewCount: "25000",
      likeCount: "800",
      tags: ["js-stack", "demo", "tutorial", "localhost"],
    }
  );
}

// Mock function to simulate YouTube API response (for development)
export function getMockVideoData(videoId: string): YouTubeVideoInfo {
  // Use demo data if on localhost, otherwise use generic mock data
  if (isLocalhost()) {
    return getDemoVideoData(videoId);
  }

  return {
    videoId,
    title: "Sample Video Title",
    description:
      "This is a sample video description for demonstration purposes.",
    thumbnail: getVideoThumbnail(videoId),
    duration: "PT10M30S",
    publishedAt: new Date().toISOString(),
    channelTitle: "Sample Channel",
    viewCount: "1000000",
    likeCount: "50000",
    tags: ["sample", "demo", "tutorial"],
  };
}

// Fetch video data from YouTube (with localhost detection and oEmbed fallback)
export async function fetchYouTubeVideoData(
  videoUrl: string,
): Promise<YouTubeVideoData | null> {
  try {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Use demo data on localhost for consistent testing
    if (isLocalhost()) {
      console.log("🏠 Localhost detected - using demo video data");
      const videoInfo = getDemoVideoData(videoId);

      return {
        id: videoInfo.videoId,
        title: videoInfo.title,
        description: videoInfo.description,
        thumbnail: videoInfo.thumbnail,
        duration: formatDuration(videoInfo.duration),
        publishedAt: videoInfo.publishedAt,
        channelTitle: videoInfo.channelTitle,
        viewCount: formatViewCount(videoInfo.viewCount),
        likeCount: formatViewCount(videoInfo.likeCount),
        tags: videoInfo.tags,
        url: videoUrl,
      };
    }

    // Production: Try YouTube Data API first, then fall back to oEmbed
    console.log("🌐 Production environment - fetching YouTube data");
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    if (apiKey) {
      try {
        // Try YouTube Data API first for full metadata
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${apiKey}`,
        );

        if (response.ok) {
          const data = await response.json();

          if (data.items && data.items.length > 0) {
            const video = data.items[0];
            const snippet = video.snippet;
            const statistics = video.statistics;
            const contentDetails = video.contentDetails;

            console.log("✅ Using YouTube Data API");
            return {
              id: videoId,
              title: snippet.title,
              description: snippet.description,
              thumbnail:
                snippet.thumbnails.maxres?.url ||
                snippet.thumbnails.high?.url ||
                getVideoThumbnail(videoId),
              duration: formatDuration(contentDetails.duration),
              publishedAt: snippet.publishedAt,
              channelTitle: snippet.channelTitle,
              viewCount: formatViewCount(statistics.viewCount || "0"),
              likeCount: formatViewCount(statistics.likeCount || "0"),
              tags: snippet.tags || [],
              url: videoUrl,
            };
          }
        }
      } catch (apiError) {
        console.warn(
          "YouTube Data API failed, falling back to oEmbed:",
          apiError,
        );
      }
    }

    // Fallback to oEmbed (no API key required)
    console.log("📡 Using YouTube oEmbed API (no API key required)");
    return await fetchYouTubeVideoDataOEmbed(videoUrl);
  } catch (error) {
    console.error("Error fetching YouTube video data:", error);
    return null;
  }
}

// Real YouTube API implementation (requires API key)
export async function fetchYouTubeVideoDataReal(
  videoUrl: string,
  apiKey: string,
): Promise<YouTubeVideoData | null> {
  try {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found");
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;
    const contentDetails = video.contentDetails;

    return {
      id: videoId,
      title: snippet.title,
      description: snippet.description,
      thumbnail:
        snippet.thumbnails.maxres?.url ||
        snippet.thumbnails.high?.url ||
        getVideoThumbnail(videoId),
      duration: formatDuration(contentDetails.duration),
      publishedAt: snippet.publishedAt,
      channelTitle: snippet.channelTitle,
      viewCount: formatViewCount(statistics.viewCount || "0"),
      likeCount: formatViewCount(statistics.likeCount || "0"),
      tags: snippet.tags || [],
      url: videoUrl,
    };
  } catch (error) {
    console.error("Error fetching YouTube video data:", error);
    return null;
  }
}
