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
    <motion.div className="mt-8" variants={containerVariants}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-primary" />
          <div>
            <span className="font-bold text-xl sm:text-2xl">
              SPONSORSHIP_CTA.LOG
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              Support the project and get featured recognition
            </p>
          </div>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="text-muted-foreground text-sm font-medium">
          [CALL TO ACTION]
        </span>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card/50 shadow-sm">
        <div className="sticky top-0 z-10 border-border border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm">🚀</span>
            <span className="font-semibold text-sm">[BECOME_SPONSOR]</span>
          </div>
        </div>
        <div className="p-6">
          <div className="text-base text-foreground mb-6 leading-relaxed">
            Support js-stack development and get featured recognition across our
            platforms. Help us build the best full-stack development tool for
            the community.
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" size="lg" className="font-mono" asChild>
              <a
                href="https://github.com/sponsors/vipinyadav01"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Heart className="h-4 w-4 mr-2" />
                SPONSOR ON GITHUB
              </a>
            </Button>
            <Button variant="outline" size="lg" className="font-mono" asChild>
              <a href="mailto:vipinxdev@gmail.com">
                <ExternalLink className="h-4 w-4 mr-2" />
                CONTACT US
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
