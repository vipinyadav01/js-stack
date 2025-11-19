"use client";

import { motion } from "framer-motion";
import { Github, Heart, MessageCircle, Play } from "lucide-react";
import Hero from "@/components/home/hero";
import Command from "@/components/home/command";
import ProjectInt from "@/components/home/ProjectInt";
import TopSponsors from "@/components/home/TopSponsors";
import TopComments from "@/components/home/TopComments";
import VideoTutorials from "@/components/home/VideoTutorials";
import { FAQStructuredData } from "@/components/structured-data";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

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

  return (
    <>
      <FAQStructuredData faqs={faqs} />
      <div className="w-full max-w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Terminal Header */}
          <motion.div
            className="mb-8"
            variants={containerVariants}
          ></motion.div>

          {/* Hero Section */}
          <motion.div className="mb-6 sm:mb-8" variants={containerVariants}>
            <Hero />
          </motion.div>

          {/* Command Section */}
          <motion.div className="mb-6 sm:mb-8" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <Command />
            </div>
          </motion.div>

          {/* Integration Guide */}
          <motion.div className="mb-6 sm:mb-8" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <ProjectInt />
            </div>
          </motion.div>

          {/* Top Sponsors */}
          <motion.div className="mb-8 sm:mb-12" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg sm:text-xl lg:text-2xl">
                      Top Sponsors
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Supported by community
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
                <TopSponsors repository="vipinyadav01" limit={10} />
              </div>
            </div>
          </motion.div>

          {/* Top Comments */}
          <motion.div className="mb-8 sm:mb-12" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg sm:text-xl lg:text-2xl">
                      Community Feedback
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      What developers are saying
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
                <TopComments repository="js-stack" limit={10} />
              </div>
            </div>
          </motion.div>

          {/* Video Tutorials */}
          <motion.div className="mb-8 sm:mb-12" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg sm:text-xl lg:text-2xl">
                      Video Tutorials
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Learn with step-by-step guides
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
                <VideoTutorials limit={4} />
              </div>
            </div>
          </motion.div>

          {/* Community Section */}
          <motion.div className="mb-8 sm:mb-12" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg sm:text-xl lg:text-2xl">
                      Community Support
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Open source and free forever
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-gradient-to-br from-card/50 to-card/30 p-6 sm:p-8 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <p className="text-base sm:text-lg text-foreground font-medium">
                    Built with ❤️ by the open source community
                  </p>
                  <div className="flex justify-center gap-4">
                    <a
                      href="https://github.com/vipinyadav01/js-stack"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                    <a
                      href="https://vipinyadav01.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                    >
                      <Heart className="h-4 w-4" />
                      Author
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
