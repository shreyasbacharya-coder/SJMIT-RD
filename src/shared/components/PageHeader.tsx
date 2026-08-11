import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: React.ReactNode;
  description: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-10">
      <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-950 dark:text-white mb-4 tracking-tight">
              {title}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300">
              {description}
          </p>
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
  </div>
  );
}
