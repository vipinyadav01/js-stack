import {
  extractYouTubeVideoId,
  getVideoEmbedUrl,
  fetchYouTubeVideoData,
} from "./youtube-api";

export interface VideoTutorial {
  id: string;
  url: string;
  category: "tutorial" | "demo" | "setup" | "advanced";
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

export const videoTutorials: VideoTutorial[] = [
  // Example (add demo videos as needed)
  // {
  //   id: "yt-1",
  //   url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  //   category: "demo",
  //   title: "JS-Stack Full Walkthrough",
  //   description: "Learn how to scaffold a full-stack JS project using JS-Stack CLI.",
  //   thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  //   duration: "12:34",
  //   publishedAt: "2024-03-01",
  //   channel: "JS-Stack",
  //   viewCount: "12,345",
  //   likeCount: "987",
  //   tags: ["js-stack", "tutorial", "fullstack"],
  // }
];

export const getVideoEmbedUrlFromUrl = (url: string): string => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? getVideoEmbedUrl(videoId) : "";
};

export const getVideoWatchUrlFromUrl = (url: string): string => {
  return url;
};

/**
 * Automatically fetch all video data from a YouTube URL
 * This function extracts the video ID and fetches complete metadata
 * including title, description, thumbnail, duration, views, likes, etc.
 */
export async function getVideoDataFromUrl(
  url: string,
  category: VideoTutorial["category"] = "tutorial",
): Promise<VideoTutorial | null> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Fetch all video data from YouTube
    const videoData = await fetchYouTubeVideoData(url);

    if (!videoData) {
      return null;
    }

    // Map YouTube data to VideoTutorial format
    const videoTutorial: VideoTutorial = {
      id: videoId,
      url: url,
      category: category,
      title: videoData.title,
      description: videoData.description,
      thumbnail: videoData.thumbnail,
      duration: videoData.duration,
      publishedAt: videoData.publishedAt,
      channel: videoData.channelTitle,
      viewCount: videoData.viewCount,
      likeCount: videoData.likeCount,
      tags: videoData.tags,
    };

    return videoTutorial;
  } catch (error) {
    console.error("Error fetching video data from URL:", error);
    return null;
  }
}

/**
 * Batch fetch video data from multiple URLs
 * Useful for populating multiple videos at once
 */
export async function getVideoDataFromUrls(
  urls: string[],
  category: VideoTutorial["category"] = "tutorial",
): Promise<VideoTutorial[]> {
  const results = await Promise.all(
    urls.map((url) => getVideoDataFromUrl(url, category)),
  );

  // Filter out null results
  return results.filter((video): video is VideoTutorial => video !== null);
}
