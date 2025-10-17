import { extractYouTubeVideoId, getVideoEmbedUrl } from "./youtube-api";

export interface VideoTutorial {
  id: string;
  url: string; // YouTube URL
  category: "tutorial" | "demo" | "setup" | "advanced";
  // All other data will be fetched automatically from YouTube
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  publishedAt?: string;
  channel?: string;
  viewCount?: string;
  likeCount?: string;
  tags?: string[];
}

// Simple array of YouTube URLs with categories
export const videoTutorials: VideoTutorial[] = [
  {
    id: "1",
    url: "https://youtu.be/Ihf16CL0z7I?si=_j15kWtI3JFvz-A8", // Your actual YouTube URL
    category: "tutorial",
  },
  {
    id: "2",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Demo data on localhost, real data in production
    category: "demo",
  },
  {
    id: "3",
    url: "https://www.youtube.com/watch?v=abc123def456", // Demo data on localhost, real data in production
    category: "advanced",
  },
  {
    id: "4",
    url: "https://youtu.be/Ihf16CL0z7I?si=_j15kWtI3JFvz-A8", // Demo data on localhost, real data in production
    category: "setup",
  },
];

// Helper functions for video URLs
export const getVideoEmbedUrlFromUrl = (url: string) => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? getVideoEmbedUrl(videoId) : "";
};

export const getVideoWatchUrlFromUrl = (url: string) => {
  return url; // Already a watch URL
};
