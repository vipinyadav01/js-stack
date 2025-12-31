"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import Hero from "@/components/home/hero";
import Command from "@/components/home/command";
import ProjectInt from "@/components/home/ProjectInt";
import TopSponsors from "@/components/home/TopSponsors";
import TopComments from "@/components/home/TopComments";
import VideoTutorials from "@/components/home/VideoTutorials";
import { FAQStructuredData } from "@/components/structured-data";
import { Github, Heart } from "lucide-react";

import { motion, type Variants } from "framer-motion";

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
        "You can install JS-Stack CLI using npm with the command: npx create-js-stack@latest my-app. No global installation required. You can also use 'npx create-js-stack@latest init my-app' for the same result.",
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

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <FAQStructuredData faqs={faqs} />
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Hero />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32 pb-24">
          {/* Quick Start Section */}
          <motion.section
            id="quick-start"
            className="scroll-mt-24 will-change-transform"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <Command />
          </motion.section>

          {/* Features Section */}
          <motion.section
            id="features"
            className="scroll-mt-24 will-change-transform"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <ProjectInt />
          </motion.section>

          {/* Tutorials Section */}
          <motion.section
            id="tutorials"
            className="scroll-mt-24 will-change-transform"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <VideoTutorials limit={3} />
          </motion.section>

          {/* Community Feedback */}
          <motion.section
            id="feedback"
            className="scroll-mt-24 will-change-transform"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <TopComments repository="js-stack" limit={6} />
          </motion.section>

          {/* Sponsors */}
          <motion.section
            id="sponsors"
            className="scroll-mt-24 will-change-transform"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <TopSponsors repository="vipinyadav01" limit={12} />
          </motion.section>

          {/* Community / Footer Section */}
          <motion.section
            className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-card/50 px-6 py-16 text-center shadow-lg md:px-12 will-change-transform"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to Ship?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of developers building production-ready apps with
                JS-Stack. Open source and free forever.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/vipinyadav01/js-stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-lg hover:shadow-primary/20"
                >
                  <Github className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Give it a Star
                </a>
                <a
                  href="https://vipinyadav01.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-lg hover:shadow-primary/20"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500/20 transition-transform group-hover:scale-110" />
                  Meet the Author
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
}
