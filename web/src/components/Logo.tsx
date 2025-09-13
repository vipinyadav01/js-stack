import React from 'react';
import { Code2 } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Terminal Icon with Code Symbol */}
      <div className="relative">
        {/* Terminal Background */}
        <div className={`${sizeClasses[size]} rounded border-2 border-primary bg-background flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          
          {/* Code Symbol */}
          <Code2 className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} text-primary relative z-10`} />
          
          {/* Terminal Cursor Effect */}
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-primary animate-pulse" />
        </div>
        
        {/* Terminal Glow Effect */}
        <div className="absolute inset-0 rounded border-2 border-primary/30 blur-sm" />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold font-mono text-foreground ${textSizes[size]}`}>
            JS-Stack
          </span>
          <span className={`font-mono text-muted-foreground ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
            create-js-stack
          </span>
        </div>
      )}
    </div>
  );
}

// Simple Icon Version for Favicon
export function LogoIcon({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`${sizeClasses[size]} rounded border-2 border-primary bg-background flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* Terminal Screen Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
      
      {/* Code Symbol */}
      <Code2 className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} text-primary relative z-10`} />
      
      {/* Terminal Cursor Effect */}
      <div className="absolute bottom-1 right-1 w-1 h-1 bg-primary animate-pulse" />
    </div>
  );
}
