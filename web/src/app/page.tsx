"use client";

import { motion } from "framer-motion";
import { Terminal, Github, Heart } from "lucide-react";
import Hero from "@/components/hero";
import Command from "@/components/command";
import ProjectInt from "@/components/ProjectInt";
import TopSponsors from "@/components/TopSponsors";
import TopComments from "@/components/TopComments";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  return (
    <div className="w-full max-w-full overflow-hidden px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Terminal Header */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                JS_STACK_CLI.LOG
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [PROJECT INITIALIZATION]
            </span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div className="mb-8" variants={containerVariants}>
          <Hero />
        </motion.div>

        {/* Command Section */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mx-auto max-w-[1280px]">
            <Command />
          </div>
        </motion.div>

        {/* Integration Guide */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mx-auto max-w-[1280px]">
            <ProjectInt />
          </div>
        </motion.div>

        {/* Top Sponsors & Comments */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg sm:text-xl">
                  COMMUNITY_HIGHLIGHTS.LOG
                </span>
              </div>
              <div className="hidden h-px flex-1 bg-border sm:block" />
              <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
                [TOP CONTRIBUTORS & FEEDBACK]
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopSponsors repository="vipinyadav01" limit={10} />
              <TopComments repository="js-stack" limit={10} />
            </div>
          </div>
        </motion.div>

        {/* Community Section */}
        <motion.div className="mb-8" variants={containerVariants}>
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg sm:text-xl">
                  COMMUNITY.SUPPORT
                </span>
              </div>
              <div className="hidden h-px flex-1 bg-border sm:block" />
              <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
                [OPEN SOURCE]
              </span>
            </div>
            
            <div className="rounded border border-border p-6">
              <div className="text-center space-y-4">
                <div className="text-sm text-foreground">
                  Built with ❤️ by the open source community
                </div>
                <div className="flex justify-center gap-4">
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

        {/* End of File */}
        <motion.div className="mb-4 mt-8" variants={containerVariants}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-muted-foreground" />
              <span className="font-bold text-lg sm:text-xl text-muted-foreground">
                END_OF_FILE
              </span>
            </div>
            <div className="hidden h-px flex-1 bg-border sm:block" />
            <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
              [HOME.LOG]
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
