import React from 'react';
import { cn } from '../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-white/5 text-slate-400 border-white/10',
    success: 'bg-brand-end/10 text-brand-end border-brand-end/20',
    warning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    error: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
    info: 'bg-brand-start/10 text-brand-start border-brand-start/20',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
