"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Play, Youtube, ExternalLink, Loader2 } from "lucide-react";
import {
  videoTutorials,
  getVideoEmbedUrlFromUrl,
  getVideoWatchUrlFromUrl,
  type VideoTutorial,
} from "@/lib/video-data";
import {
  fetchYouTubeVideoData,
  type YouTubeVideoData,
} from "@/lib/youtube-api";

interface VideoTutorialsProps {
  limit?: number;
}

interface VideoWithData extends VideoTutorial {
  youtubeData?: YouTubeVideoData;
  loading?: boolean;
  error?: string;
}

export default function VideoTutorials({ limit = 4 }: VideoTutorialsProps) {
  const [videos, setVideos] = useState<VideoWithData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoWithData | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch video data for all videos
  useEffect(() => {
    const fetchAllVideoData = async () => {
      const videosWithData: VideoWithData[] = [];

      for (const video of videoTutorials.slice(0, limit)) {
        const videoWithData: VideoWithData = { ...video, loading: true };
        videosWithData.push(videoWithData);
        setVideos([...videosWithData]);

        try {
          const youtubeData = await fetchYouTubeVideoData(video.url);
          if (youtubeData) {
            videoWithData.youtubeData = youtubeData;
            videoWithData.loading = false;
          } else {
            videoWithData.error = "Failed to fetch video data";
            videoWithData.loading = false;
          }
        } catch {
          videoWithData.error = "Error loading video";
          videoWithData.loading = false;
        }

        setVideos([...videosWithData]);
      }
    };

    fetchAllVideoData();
  }, [limit]);

  const handleVideoSelect = (video: VideoWithData) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-muted-foreground" />
            <span className="font-bold text-lg sm:text-xl text-muted-foreground">
              VIDEO_TUTORIALS
            </span>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
            [TUTORIALS.MP4]
          </span>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group/video overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50 cursor-pointer"
              onClick={() =>
                !video.loading && !video.error && handleVideoSelect(video)
              }
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                {video.loading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : video.error ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center">
                      <Youtube className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Failed to load
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      src={
                        video.youtubeData?.thumbnail ||
                        "https://via.placeholder.com/400x225"
                      }
                      alt={video.youtubeData?.title || "Video thumbnail"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/video:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="opacity-0 group-hover/video:opacity-100 rounded-full bg-red-600 p-2.5 transition-opacity">
                        <Play className="h-5 w-5 text-white ml-0.5" />
                      </div>
                    </div>
                    {video.youtubeData?.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {video.youtubeData.duration}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                {video.loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 bg-muted/50 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : video.error ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">
                      Failed to load video data
                    </p>
                  </div>
                ) : (
                  <>
                    <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                      {video.youtubeData?.title || "Video Title"}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {video.youtubeData?.description || "Video description"}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-4 pt-4 border-t border-border">
          <a
            href="https://www.youtube.com/@jsstack"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Youtube className="h-4 w-4" />
            <span>View All Tutorials</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl mx-4 bg-background rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-sm">Video Player</span>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video">
              <iframe
                src={getVideoEmbedUrlFromUrl(selectedVideo.url)}
                title={selectedVideo.youtubeData?.title || "Video"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="p-4 border-t border-border">
              <h3 className="font-semibold text-base text-foreground mb-2">
                {selectedVideo.youtubeData?.title || "Video Title"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedVideo.youtubeData?.description || "Video description"}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {selectedVideo.youtubeData?.channelTitle || "Channel"}
                  {selectedVideo.youtubeData?.viewCount && (
                    <span> · {selectedVideo.youtubeData.viewCount} views</span>
                  )}
                </div>
                <a
                  href={getVideoWatchUrlFromUrl(selectedVideo.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Youtube className="h-3 w-3" />
                  <span>Watch on YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
