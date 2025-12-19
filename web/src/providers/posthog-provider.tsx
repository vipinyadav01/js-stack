"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (posthogKey && typeof window !== "undefined") {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true, // Auto-track clicks, form submissions
        session_recording: {
          recordCrossOriginIframes: true,
        },
        loaded: (posthogInstance) => {
          if (process.env.NODE_ENV === "development") {
            posthogInstance.debug();
          }
        },
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Component to handle automatic pageview tracking
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
