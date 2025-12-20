"use client";

import { useState, useEffect } from "react";
import { X, BarChart3, Shield } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";

export function AnalyticsConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    // Check if user has already made a choice
    if (typeof window !== "undefined") {
      const hasConsented = window.localStorage.getItem("analytics_consent");
      if (hasConsented === null) {
        // First visit, show banner after a short delay
        const timer = setTimeout(() => setShowBanner(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAccept = () => {
    posthog?.opt_in_capturing();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("analytics_consent", "accepted");
    }
    setShowBanner(false);
  };

  const handleDecline = () => {
    posthog?.opt_out_capturing();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("analytics_consent", "declined");
    }
    setShowBanner(false);
  };

  const handleClose = () => {
    // Dismissing without choice = implicit accept (common pattern)
    handleAccept();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-lg border border-border bg-card shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Analytics</h3>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground p-1 -m-1"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              We use anonymous analytics to improve JS-Stack. No personal data
              is collected.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Shield className="h-3 w-3" />
              <span>Privacy-friendly · No cookies for tracking</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAccept} className="flex-1">
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecline}
                className="flex-1"
              >
                Decline
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Privacy Settings Component (for settings page)
 */
export function PrivacySettings() {
  const posthog = usePostHog();
  const [isOptedOut, setIsOptedOut] = useState(false);

  useEffect(() => {
    if (posthog) {
      setIsOptedOut(posthog.has_opted_out_capturing());
    }
  }, [posthog]);

  const toggleAnalytics = () => {
    if (isOptedOut) {
      posthog?.opt_in_capturing();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("analytics_consent", "accepted");
      }
      setIsOptedOut(false);
    } else {
      posthog?.opt_out_capturing();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("analytics_consent", "declined");
      }
      setIsOptedOut(true);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Anonymous Analytics</h4>
            <p className="text-xs text-muted-foreground">
              Help improve JS-Stack with anonymous usage data
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant={isOptedOut ? "default" : "outline"}
          onClick={toggleAnalytics}
        >
          {isOptedOut ? "Enable" : "Disable"}
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <h5 className="text-xs font-medium mb-2">What we collect:</h5>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Page views and navigation patterns</li>
          <li>• Stack builder selections</li>
          <li>• Performance metrics (page load times)</li>
          <li>• Error occurrences (anonymized)</li>
        </ul>
        <h5 className="text-xs font-medium mt-3 mb-2">
          What we don&apos;t collect:
        </h5>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Personal information</li>
          <li>• IP addresses</li>
          <li>• Cookies for tracking</li>
        </ul>
      </div>
    </div>
  );
}
