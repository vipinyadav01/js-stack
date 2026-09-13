import React from "react";

interface NpmIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  variant?: "brand" | "monochrome";
}

/**
 * Official NPM Logo component.
 * Supports:
 * - 'brand': Official NPM red background (#CB3837) with crisp white lettering.
 * - 'monochrome': Inherits text color (currentColor) with transparent cutout.
 */
export function NpmIcon({
  className = "size-4",
  variant = "brand",
  ...props
}: NpmIconProps) {
  if (variant === "monochrome") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path
          fill="currentColor"
          d="M1.5 6.75h21v10.5h-10.5v1.5h-5.25v-1.5H1.5V6.75zm2.625 2.625v5.25h2.625v-5.25H4.125zm5.25 0v6.75h2.625v-6.75H9.375zm5.25 0v5.25h2.625V12h2.625V9.375h-5.25zm2.625 2.625H16.5v1.313h.75V12z"
        />
      </svg>
    );
  }

  // Official brand red (#CB3837) badge with white text
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Background container */}
      <rect width="24" height="24" rx="4" fill="#CB3837" />
      {/* Crisp NPM letter paths */}
      <path
        fill="#FFFFFF"
        d="M4 7h16v10H12v1.5H8.5V17H4V7zm2.5 2.5v5h2.5v-5H6.5zm5 0v6.5H14V9.5h-2.5zm5 0v5h2.5V12h2.5V9.5H16.5zm2.5 2.5h-1.25v1.25H19V12z"
      />
    </svg>
  );
}
