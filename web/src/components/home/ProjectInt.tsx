import React from "react";
import { Terminal } from "lucide-react";

export default function ProjectInt() {
  return (
    <>
      <section className="space-y-8">
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [CLI COMMANDS]
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
