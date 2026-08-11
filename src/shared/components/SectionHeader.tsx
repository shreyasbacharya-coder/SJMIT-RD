import React from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16 max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-950 dark:text-white mb-6">{title}</h2>
      <p className="text-slate-700 dark:text-slate-300 font-medium">{description}</p>
    </div>
  );
}
