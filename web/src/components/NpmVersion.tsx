"use client";

import { useEffect, useState } from "react";

const NpmVersion = () => {
  const [version, setVersion] = useState("0.0.0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLatestVersion = async () => {
      try {
        setLoading(true);

        // First try NPM registry (more reliable, shows latest published)
        const npmRes = await fetch(
          "https://registry.npmjs.org/create-js-stack",
        );
        if (npmRes.ok) {
          const npmData = await npmRes.json();
          const latestVersion = npmData["dist-tags"]?.latest;
          if (latestVersion) {
            setVersion(latestVersion);
            setLoading(false);
            return;
          }
        }

        // Fallback to GitHub releases
        const githubRes = await fetch(
          "https://api.github.com/repos/vipinyadav01/js-stack/releases",
        );
        if (githubRes.ok) {
          const githubData = await githubRes.json();
          if (
            githubData &&
            Array.isArray(githubData) &&
            githubData.length > 0 &&
            githubData[0]?.tag_name
          ) {
            const latestVersion = githubData[0].tag_name.replace(/^v/, "");
            setVersion(latestVersion);
          } else {
            throw new Error("No GitHub releases found");
          }
        } else {
          throw new Error("Failed to fetch from both NPM and GitHub");
        }
      } catch (error) {
        console.error("Error fetching version:", error);
        setVersion("latest");
      } finally {
        setLoading(false);
      }
    };
    getLatestVersion();
  }, []);

  return (
    <div className="mt-2 flex items-center justify-center">
      <span className="mr-2 inline-block h-5 w-3 bg-primary animate-pulse" />
      <span className="text-muted-foreground text-xl">
        [{loading ? "..." : `v${version}`}]
      </span>
    </div>
  );
};

export default NpmVersion;
