"use client";

import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function CTASection() {
  return (
    <motion.div className="mt-12" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            SPONSORSHIP_CTA.LOG
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          [CALL TO ACTION]
        </span>
      </div>
      
      <div className="w-full min-w-0 overflow-hidden rounded border border-border">
        <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">🚀</span>
            <span className="font-semibold text-xs">
              [BECOME_SPONSOR]
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-foreground mb-4">
            Support js-stack development and get featured recognition across our platforms. 
            Help us build the best full-stack development tool for the community.
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" className="font-mono" asChild>
              <a href="https://github.com/sponsors/vipinyadav01" target="_blank" rel="noopener noreferrer">
                <Heart className="h-4 w-4" />
                SPONSOR ON GITHUB
              </a>
            </Button>
            <Button variant="outline" className="font-mono" asChild>
              <a href="mailto:vipinxdev@gmail.com">
                <ExternalLink className="h-4 w-4" />
                CONTACT US
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
