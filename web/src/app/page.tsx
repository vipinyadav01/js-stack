"use client";

import { motion } from "framer-motion";
import { Github, Heart } from "lucide-react";
import Hero from "@/components/hero";
import Command from "@/components/command";
import ProjectInt from "@/components/ProjectInt";
import TopSponsors from "@/components/TopSponsors";
import TopComments from "@/components/TopComments";
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
        "You can install JS-Stack CLI using npm with the command: npx create-js-stack@latest init my-app. No global installation required.",
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

          {/* Top Sponsors & Comments */}
          <motion.div className="mb-6 sm:mb-8" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <h2 className="font-bold text-base sm:text-lg lg:text-xl">
                    COMMUNITY_HIGHLIGHTS.LOG
                  </h2>
                </div>
                <div className="hidden h-px flex-1 bg-border sm:block" />
                <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
                  [TOP CONTRIBUTORS & FEEDBACK]
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <TopSponsors repository="vipinyadav01" limit={10} />
                <TopComments repository="js-stack" limit={10} />
              </div>
            </div>
          </motion.div>

          {/* Community Section */}
          <motion.div className="mb-6 sm:mb-8" variants={containerVariants}>
            <div className="mx-auto max-w-[1280px]">
              <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <h2 className="font-bold text-base sm:text-lg lg:text-xl">
                    COMMUNITY.SUPPORT
                  </h2>
                </div>
                <div className="hidden h-px flex-1 bg-border sm:block" />
                <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
                  [OPEN SOURCE]
                </span>
              </div>

              <div className="rounded border border-border p-4 sm:p-6">
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="text-sm sm:text-base text-foreground">
                    Built with ❤️ by the open source community
                  </div>
                  <div className="flex justify-center gap-3 sm:gap-4">
                    <a
                      href="https://github.com/vipinyadav01/js-stack"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                    <a
                      href="https://vipinyadav01.vercel.app"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
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
