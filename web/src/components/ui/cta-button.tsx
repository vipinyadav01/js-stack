import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ctaButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-mono font-medium transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white font-semibold shadow-sm shadow-orange-500/25 hover:shadow-md hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        secondary:
          "border border-border/80 dark:border-white/10 bg-secondary/80 hover:bg-secondary text-foreground hover:border-border/90 dark:hover:border-white/20 shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        outline:
          "border border-border/80 dark:border-white/10 bg-background/80 hover:bg-muted/50 text-foreground hover:border-primary/40 dark:hover:border-primary/40 shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-white/[0.06] active:scale-[0.97]",
        icon: "border border-border/60 dark:border-white/10 bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground shadow-xs hover:scale-105 active:scale-95",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg gap-1.5 [&_svg]:size-3.5",
        md: "h-9 px-4 text-xs sm:text-sm rounded-lg gap-2 [&_svg]:size-4",
        lg: "h-11 px-6 text-sm sm:text-base rounded-xl gap-2.5 [&_svg]:size-4.5",
        icon: "size-8 p-0 rounded-lg justify-center [&_svg]:size-4",
        "icon-sm": "size-7 p-0 rounded-md justify-center [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface CTAButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ctaButtonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(ctaButtonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

CTAButton.displayName = "CTAButton";
export { ctaButtonVariants };
