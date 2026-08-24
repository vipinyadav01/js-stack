"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

export default function FAQ({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-full">
      <div>
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 font-mono text-sm tracking-tight text-foreground">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="font-bold text-primary">FREQUENTLY_ASKED_QUESTIONS</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs text-muted-foreground font-normal">faq.md</span>
          </div>
          <span className="w-full text-right font-mono text-muted-foreground text-xs sm:w-auto sm:text-left">
            [HELP & GUIDANCE]
          </span>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "rounded-lg border transition-all duration-200 overflow-hidden",
                  isOpen
                    ? "border-primary/60 bg-card/80 shadow-md shadow-primary/5"
                    : "border-border/60 bg-card/40 hover:border-border"
                )}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-4 text-left transition-colors font-mono"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="text-xs text-primary font-bold">
                      0{index + 1}.
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-96" : "max-h-0"
                  )}
                >
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-10 font-sans border-t border-border/40">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
