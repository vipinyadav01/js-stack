import { extractYouTubeVideoId, getVideoEmbedUrl } from "./youtube-api";

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
  {
    id: "1",
    url: "https://youtu.be/Ihf16CL0z7I?si=_j15kWtI3JFvz-A8",
    category: "tutorial",
  },
  {
    id: "2",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "demo",
  },
  {
    id: "3",
    url: "https://www.youtube.com/watch?v=abc123def456",
    category: "advanced",
  },
  {
    id: "4",
    url: "https://youtu.be/Ihf16CL0z7I?si=_j15kWtI3JFvz-A8",
    category: "setup",
  },
];

export const getVideoEmbedUrlFromUrl = (url: string) => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? getVideoEmbedUrl(videoId) : "";
};

export const getVideoWatchUrlFromUrl = (url: string) => {
  return url;
};
