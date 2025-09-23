"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ResponsiveLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  className?: string;
}

export function ResponsiveLayout({ sidebar, main, className = "" }: ResponsiveLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element;
        if (!target.closest('.mobile-sidebar') && !target.closest('.mobile-menu-button')) {
          setIsMobileMenuOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  if (isMobile) {
    return (
      <div className={`relative ${className}`}>
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <h1 className="font-bold text-lg">JS Stack Builder</h1>
            <button
              className="mobile-menu-button p-2 rounded-md border border-border bg-background hover:bg-muted/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="mobile-sidebar fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background border-r border-border z-50 overflow-y-auto"
              >
                <div className="p-4">
                  {sidebar}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Main Content */}
        <div className="lg:hidden p-4">
          {main}
        </div>
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-[380px_auto_1fr] ${className}`}>
      <div className="lg:sticky lg:top-24 self-start">
        {sidebar}
      </div>
      
      <Separator />
      
      <div className="lg:h-[calc(100vh-10rem)] overflow-y-auto pr-1">
        {main}
      </div>
    </div>
  );
}
