"use client";

import { FileX, Home, Terminal, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto min-h-svh max-w-[1280px]">
      <main className="mx-auto px-4 pt-12">
        {/* Error Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-2">
            <FileX className="h-6 w-6 text-destructive" />
            <h1 className="font-bold text-2xl">404 - Page Not Found</h1>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-muted"
          >
            <Terminal className="h-4 w-4" />
            View Docs
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
}
