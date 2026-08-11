import React from 'react';
import { UnifiedEquipment } from '../hooks/useEquipmentList';
import { EquipmentCard } from './EquipmentCard';
import { SearchX, Beaker } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface EquipmentGridProps {
  equipments: UnifiedEquipment[];
  isLoading: boolean;
  onClearFilters?: () => void;
  view: 'grid' | 'list';
}

export function EquipmentGrid({ equipments, isLoading, onClearFilters, view }: EquipmentGridProps) {
  if (isLoading) {
    return (
      <div className={cn(
        view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'flex flex-col gap-4'
      )}>
        {view === 'grid' 
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="h-[350px] bg-slate-100 dark:bg-white/5 animate-pulse rounded-3xl border border-slate-200 dark:border-white/10" />
            ))
          : [...Array(4)].map((_, i) => (
              <div key={i} className="h-32 w-full flex gap-4 items-center bg-slate-100 dark:bg-white/5 animate-pulse rounded-3xl border border-slate-200 dark:border-white/10 p-4">
                <div className="w-28 h-28 bg-slate-200 dark:bg-white/10 rounded-2xl flex-shrink-0"></div>
                <div className="flex-1 space-y-3 py-1">
                   <div className="h-4 w-3/4 bg-slate-200 dark:bg-white/10 rounded"></div>
                   <div className="h-3 w-1/2 bg-slate-200 dark:bg-white/10 rounded"></div>
                   <div className="h-3 w-2/3 bg-slate-200 dark:bg-white/10 rounded"></div>
                </div>
              </div>
          ))
        }
      </div>
    );
  }

  if (equipments.length === 0) {
    return (
      <Card className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] bg-slate-50/50 dark:bg-transparent">
        <div className="inline-flex p-6 bg-slate-100 dark:bg-white/5 rounded-full mb-8 border border-slate-200 dark:border-white/10">
          <SearchX size={48} className="text-slate-400 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">No matching assets found</h3>
        <p className="text-slate-500 dark:text-slate-400 font-light text-base max-w-md mx-auto mb-8">
          We couldn't find any equipment matching your current search or filters. 
          Try broadening your criteria or checking for typos.
        </p>
        
        {onClearFilters && (
          <button 
            onClick={onClearFilters}
            className="px-8 py-3 bg-brand-start text-white font-bold rounded-2xl hover:bg-brand-end transition-all shadow-xl shadow-brand-start/20 mb-12"
          >
            Clear All Filters
          </button>
        )}

        <div className="flex items-center justify-center gap-4 text-brand-start">
          <Beaker size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Research Infrastructure</span>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn(
      view === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "flex flex-col gap-4"
    )}>
      {equipments.map((equipment) => (
        <Link href={`/equipment?id=${equipment.id}`} key={equipment.id} className="block no-underline h-full">
          <EquipmentCard 
            equipment={equipment} 
            view={view}
          />
        </Link>
      ))}
    </div>
  );
}
