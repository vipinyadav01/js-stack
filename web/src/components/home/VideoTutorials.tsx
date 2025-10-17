"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Youtube,
  Terminal,
  Eye,
  Loader2,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const [, setLoading] = useState(true);

  // Fetch video data for all videos
  useEffect(() => {
    const fetchAllVideoData = async () => {
      setLoading(true);
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

      setLoading(false);
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

  const getCategoryColor = (category: VideoTutorial["category"]) => {
    switch (category) {
      case "tutorial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "demo":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "setup":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 shadow-lg backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Youtube className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground">
                  Learn JS-Stack with our guides
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
              <Play className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">
                {videoTutorials.length}
              </span>
            </div>
          </div>

          {/* Video Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {videos.map((video) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                className="group/video relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                onClick={() =>
                  !video.loading && !video.error && handleVideoSelect(video)
                }
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {video.loading ? (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : video.error ? (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <Youtube className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">
                          Failed to load
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          video.youtubeData?.thumbnail ||
                          "https://via.placeholder.com/400x225"
                        }
                        alt={video.youtubeData?.title || "Video thumbnail"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover/video:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                        <div className="rounded-full bg-red-600 p-3 shadow-lg">
                          <Play className="h-6 w-6 text-white ml-0.5" />
                        </div>
                      </div>
                      {video.youtubeData?.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.youtubeData.duration}
                        </div>
                      )}
                    </>
                  )}
                  <div className="absolute top-2 left-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        getCategoryColor(video.category),
                      )}
                    >
                      <Tag className="h-3 w-3" />
                      {video.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {video.loading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted/50 rounded animate-pulse w-3/4"></div>
                    </div>
                  ) : video.error ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Failed to load video data
                      </p>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 group-hover/video:text-primary transition-colors">
                        {video.youtubeData?.title || "Video Title"}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {video.youtubeData?.description || "Video description"}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>
                              {video.youtubeData?.channelTitle || "Channel"}
                            </span>
                          </div>
                          {video.youtubeData?.publishedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  video.youtubeData.publishedAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {video.youtubeData?.viewCount && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{video.youtubeData.viewCount}</span>
                            </div>
                          )}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover/video:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            className="mt-6 pt-4 border-t border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <a
              href="https://www.youtube.com/@jsstack"
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-3 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 hover:shadow-lg hover:shadow-primary/20"
            >
              <Youtube className="h-4 w-4 transition-transform group-hover/cta:scale-110" />
              <span>View All Tutorials</span>
              <ExternalLink className="h-3 w-3 transition-transform group-hover/cta:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-4 bg-background rounded-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">VIDEO_PLAYER.TS</span>
                </div>
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
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {selectedVideo.youtubeData?.title || "Video Title"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedVideo.youtubeData?.description ||
                    "Video description"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>
                        {selectedVideo.youtubeData?.channelTitle || "Channel"}
                      </span>
                    </div>
                    {selectedVideo.youtubeData?.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{selectedVideo.youtubeData.duration}</span>
                      </div>
                    )}
                    {selectedVideo.youtubeData?.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(
                            selectedVideo.youtubeData.publishedAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedVideo.youtubeData?.viewCount && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{selectedVideo.youtubeData.viewCount} views</span>
                      </div>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
