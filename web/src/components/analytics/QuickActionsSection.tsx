"use client";

import { Zap, Copy, ExternalLink, Code, Download, GitBranch, Users } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function QuickActionsSection() {
  const actions = [
    { 
      icon: Code, 
      label: "Create New Project", 
      description: "Initialize a new project with create-js-stack",
      command: "npx create-js-stack init",
      href: "/new"
    },
    { 
      icon: Download, 
      label: "Import Project", 
      description: "Clone and setup an existing repository",
      command: "git clone <repo>",
      href: "#"
    },
    { 
      icon: GitBranch, 
      label: "Fork Repository", 
      description: "Create a fork of this repository",
      command: "gh repo fork",
      href: "https://github.com/vipinyadav01/js-stack"
    },
    { 
      icon: Users, 
      label: "Join Community", 
      description: "Connect with other developers",
      command: "Join Discord",
      href: "#"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div className="mb-8" variants={containerVariants}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg sm:text-xl">
            Quick Actions
          </span>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
          Developer commands
        </span>
      </div>
      
      <motion.div 
        className="w-full min-w-0 overflow-hidden rounded border border-border"
        variants={itemVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="sticky top-0 z-10 border-border border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs">⚡</span>
            <span className="font-semibold text-xs">
              Developer Commands
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3">
            {actions.map((action, index) => (
              <motion.div
                key={index}
                className="group flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <action.icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-sm">{action.label}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {action.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(action.command)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Copy command"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
