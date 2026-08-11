import React from 'react';
import { cn } from '../utils/cn';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  key?: string;
}

export function Section({ title, description, children, className, icon }: SectionProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          {icon && <div className="p-3 bg-brand-start/10 rounded-2xl text-brand-start border border-brand-start/20">{icon}</div>}
          <h2 className="text-4xl font-display font-bold text-white tracking-tight">{title}</h2>
        </div>
        {description && <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">{description}</p>}
      </div>
      {children}
    </section>
  );
}
