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
        "You can install JS-Stack CLI using npm with the command: npx createjsstack@latest my-app. For a fully automated setup with defaults, try: npx createjsstack@latest my-app --yolo",
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

        <div className="mx-auto max-w-[1280px] px-4 space-y-16 md:space-y-20 pb-20">
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

          {/* Community / Footer Section */}
          <section className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Ready to Ship?
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Join thousands of developers building production-ready apps with
                JS-Stack. Open source and free forever.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://github.com/vipinyadav01/js-stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Github className="h-4 w-4" />
                  Give it a Star
                </a>
                <a
                  href="https://vipinyadav01.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Heart className="h-4 w-4 text-red-500" />
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
