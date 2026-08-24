"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import Hero from "@/components/home/hero";
import Command from "@/components/home/command";
import TopSponsors from "@/components/home/TopSponsors";
import TopComments from "@/components/home/TopComments";
import VideoTutorials from "@/components/home/VideoTutorials";
import FAQ from "@/components/home/FAQ";
import { FAQStructuredData } from "@/components/structured-data";
import { Github, Heart } from "lucide-react";

export default function Home() {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture("landing_page_viewed", {
        feature: "hero",
        page: "/",
      });
    }
  }, [posthog]);

  const faqs = [
    {
      question: "What is JS-Stack CLI?",
      answer:
        "JS-Stack CLI is a comprehensive command-line tool for scaffolding production-ready JavaScript and TypeScript full-stack applications. It supports React, Next.js, Node.js, Express, databases, authentication, testing, and deployment configurations.",
    },
    {
      question: "How do I install JS-Stack CLI?",
      answer:
        "You can install JS-Stack CLI using npm with the command: npx @vipinyadav02/createjsstack@latest my-app. For a fully automated setup with defaults, try: npx @vipinyadav02/createjsstack@latest my-app --yolo",
    },
    {
      question: "What technologies does JS-Stack support?",
      answer:
        "JS-Stack supports modern technologies including React, Next.js, Node.js, Express, TypeScript, various databases (PostgreSQL, MongoDB, etc.), authentication systems, testing frameworks (Jest, Cypress), and deployment platforms.",
    },
    {
      question: "Is JS-Stack CLI free to use?",
      answer:
        "Yes, JS-Stack CLI is completely free and open-source under the MIT license. You can use it for personal and commercial projects without any restrictions.",
    },
    {
      question: "Can I customize the generated project structure?",
      answer:
        "Absolutely! JS-Stack CLI offers extensive customization options through interactive prompts and command-line flags. You can choose your preferred frontend, backend, database, authentication method, and more.",
    },
  ];

  return (
    <>
      <FAQStructuredData faqs={faqs} />
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Hero />

        <div className="mx-auto max-w-[1280px] px-4 space-y-16 md:space-y-20 pb-28 lg:pb-36">
          {/* Quick Start Section */}
          <section id="quick-start" className="scroll-mt-24">
            <Command />
          </section>

          {/* Tutorials Section */}
          <section id="tutorials" className="scroll-mt-24">
            <VideoTutorials limit={3} />
          </section>

          {/* Community Feedback */}
          <section id="feedback" className="scroll-mt-24">
            <TopComments repository="js-stack" limit={6} />
          </section>

          {/* Sponsors */}
          <section id="sponsors" className="scroll-mt-24">
            <TopSponsors repository="vipinyadav01" limit={12} />
          </section>

          {/* FAQ Section */}
          <section id="faq" className="scroll-mt-24">
            <FAQ faqs={faqs} />
          </section>

          {/* Community / Footer CTA Banner with Cloudflare Corner Crosshairs */}
          <section className="relative overflow-hidden rounded-xl border border-primary/40 bg-card/60 backdrop-blur-xl p-8 sm:p-14 text-center shadow-2xl">
            {/* Corner crosshairs decor */}
            <div className="pointer-events-none absolute -left-1.5 -top-1.5 h-3 w-3 rounded-sm border border-primary/50 bg-background" />
            <div className="pointer-events-none absolute -right-1.5 -top-1.5 h-3 w-3 rounded-sm border border-primary/50 bg-background" />
            <div className="pointer-events-none absolute -left-1.5 -bottom-1.5 h-3 w-3 rounded-sm border border-primary/50 bg-background" />
            <div className="pointer-events-none absolute -right-1.5 -bottom-1.5 h-3 w-3 rounded-sm border border-primary/50 bg-background" />

            <div className="mx-auto max-w-3xl space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% Free & Open Source · MIT Licensed</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-mono font-extrabold tracking-tight text-foreground">
                Ready to Ship Your Next Big App?
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans max-w-xl mx-auto">
                Join thousands of developers building production-ready JavaScript & TypeScript applications with JS-Stack CLI.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a
                  href="https://github.com/vipinyadav01/js-stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 font-mono text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.01]"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </a>
                <a
                  href="https://vipinyadav01.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border border-border bg-card px-8 py-3.5 font-mono text-sm font-medium text-foreground hover:border-primary/50 transition-all"
                >
                  <Heart className="h-4 w-4 text-pink-500" />
                  Meet the Author
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
