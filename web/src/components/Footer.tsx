import React from "react";
import {
  Github,
  ExternalLink,
  Heart,
  Terminal,
  Code,
  Package,
  Users,
  Star,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "PROJECT_INFO",
      icon: Terminal,
      items: [
        {
          label: "REPOSITORY",
          value: "vipinyadav01/js-stack",
          link: "https://github.com/vipinyadav01/js-stack",
        },
        {
          label: "NPM_PACKAGE",
          value: "create-js-stack",
          link: "https://www.npmjs.com/package/create-js-stack",
        },
        { label: "VERSION", value: "1.0.10", status: "LATEST" },
        { label: "LICENSE", value: "MIT", status: "OPEN" },
      ],
    },
    {
      title: "QUICK_LINKS",
      icon: Code,
      items: [
        {
          label: "DOCUMENTATION",
          value: "View docs",
          link: "https://js-stack.pages.dev/docs",
          status: "GUIDE",
        },
        {
          label: "EXAMPLES",
          value: "Code samples",
          link: "https://github.com/js-stack/examples",
          status: "DEMO",
        },
        {
          label: "COMMUNITY",
          value: "Join Discord",
          link: "https://discord.gg/js-stack",
          status: "CHAT",
        },
        {
          label: "ISSUES",
          value: "Report bugs",
          link: "https://github.com/vipinyadav01/js-stack/issues",
          status: "BUG",
        },
      ],
    },
    {
      title: "STATS",
      icon: Package,
      items: [
        { label: "DOWNLOADS", value: "1.2K+", status: "WEEKLY" },
        { label: "STARS", value: "150+", status: "GITHUB" },
        { label: "CONTRIBUTORS", value: "5+", status: "ACTIVE" },
        { label: "RELEASES", value: "10+", status: "STABLE" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="w-full max-w-full overflow-hidden px-4">
        <div className="mx-auto max-w-[1280px] py-12">
          {/* Terminal Header */}
          <div className="mb-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg sm:text-xl">
                  FOOTER_INFO.TXT
                </span>
              </div>
              <div className="hidden h-px flex-1 bg-border sm:block" />
              <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
                [PROJECT DETAILS]
              </span>
            </div>
          </div>

          {/* Footer Sections */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
            {footerSections.map((section, index) => (
              <div key={index} className="rounded border border-border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">
                      {section.title}
                    </span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    {section.items.length}
                  </div>
                </div>

                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded border border-border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-2 hover:text-primary transition-colors"
                            >
                              <span className="text-foreground font-mono">
                                {item.value}
                              </span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                          ) : (
                            <span className="text-foreground font-mono">
                              {item.value}
                            </span>
                          )}
                        </div>
                        <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Author Info */}
            <div className="rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">AUTHOR_INFO</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  CREATOR
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-mono">
                        Vipin Yadav
                      </span>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      DEV
                    </div>
                  </div>
                </div>

                <div className="rounded border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Github className="h-4 w-4 text-primary" />
                      <a
                        href="https://github.com/vipinyadav01"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <span className="text-foreground font-mono">
                          @vipinyadav01
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      GITHUB
                    </div>
                  </div>
                </div>

                <div className="rounded border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      <a
                        href="https://vipinyadav01.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <span className="text-foreground font-mono">
                          Portfolio
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      WEBSITE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright & Credits */}
            <div className="rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">CREDITS</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  {currentYear}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-foreground font-mono">
                        Built with ❤️ by Vipin Yadav
                      </span>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      LOVE
                    </div>
                  </div>
                </div>

                <div className="rounded border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-foreground font-mono">
                        © {currentYear} All rights reserved
                      </span>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      LEGAL
                    </div>
                  </div>
                </div>

                <div className="rounded border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-foreground font-mono">
                        MIT License
                      </span>
                    </div>
                    <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                      OPEN
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Terminal Line */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
              <Terminal className="h-5 w-5" />
              <span>END_OF_FILE</span>
              <div className="h-px w-8 bg-border" />
              <span>EOF</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
