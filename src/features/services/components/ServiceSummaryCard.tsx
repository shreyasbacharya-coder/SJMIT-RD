'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Service } from '@/shared/types';
import { ArrowRight, Activity } from 'lucide-react';

interface ServiceSummaryCardProps {
  service: Service;
  onClick: () => void;
}

export function ServiceSummaryCard({ service, onClick }: ServiceSummaryCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="p-6 cursor-pointer group hover:border-brand-end/50 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-brand-end/10 text-brand-end rounded-2xl border border-brand-end/20">
          <Activity size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-end transition-colors text-lg leading-tight">{service.department}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            {service.equipments?.length || 0} equipment(s)
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-end group-hover:text-white transition-all duration-300 flex-shrink-0">
          <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Card>
  );
}
