'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Facility } from '@/shared/types';
import { ArrowRight, Building2 } from 'lucide-react';

interface FacilitySummaryCardProps {
  facility: Facility;
  onClick: () => void;
}

export function FacilitySummaryCard({ facility, onClick }: FacilitySummaryCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="p-6 cursor-pointer group hover:border-brand-start/50 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-brand-start/10 text-brand-start rounded-2xl border border-brand-start/20">
          <Building2 size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-start transition-colors text-lg leading-tight">{facility.labName}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            {facility.equipments?.length || 0} equipment(s)
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-start group-hover:text-white transition-all duration-300 flex-shrink-0">
          <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Card>
  );
}
