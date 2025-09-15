// import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

interface LogoIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const subtextSizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={size} />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold font-mono text-foreground ${textSizes[size]}`}>
            JS-Stack
          </span>
          <span className={`font-mono text-muted-foreground ${subtextSizes[size]}`}>
            create-js-stack
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ size = 'md', className = '' }: LogoIconProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} rounded border border-primary bg-background flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="relative w-full h-full">
          <img 
            src="/web-app-192x192.png" 
            alt="JS-Stack Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-primary animate-pulse rounded-full" />
      </div>
      <div className="absolute inset-0 rounded border-2 border-primary/30 blur-sm" />
    </div>
  );
}