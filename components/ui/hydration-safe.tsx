'use client';

import { ReactNode } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export function HydrationSafe({ children, className, ...props }: HydrationSafeProps) {
  return (
    <div className={className} suppressHydrationWarning {...props}>
      {children}
    </div>
  );
}

export function HydrationSafeSpan({ children, className, ...props }: HydrationSafeProps) {
  return (
    <span className={className} suppressHydrationWarning {...props}>
      {children}
    </span>
  );
}

export function HydrationSafeDiv({ children, className, ...props }: HydrationSafeProps) {
  return (
    <div className={className} suppressHydrationWarning {...props}>
      {children}
    </div>
  );
}
