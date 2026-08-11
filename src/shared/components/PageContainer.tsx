import React from 'react';
import { cn } from '../utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen bg-white dark:bg-[#0a0c10] relative", className)}>
       <div className="absolute inset-0 overflow-hidden -z-0" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-start/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-end/5 blur-[150px] rounded-full" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {children}
      </div>
    </div>
  );
}
