import React, { useState } from 'react';
import { UnifiedEquipment } from '../hooks/useEquipmentList';
import { Building2, User, Activity, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { Card } from '@/components/ui/card';

interface EquipmentCardProps {
  key?: string | number;
  equipment: UnifiedEquipment;
  view: 'grid' | 'list';
}

export function EquipmentCard({ equipment, view }: EquipmentCardProps) {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

  const images = equipment.images?.length > 0 ? equipment.images : [equipment.imageUrl];
  const isAvailable = equipment.isAvailable ?? true;

  if (view === 'list') {
    return (
      <Card 
        className="p-4 transition-all duration-300 flex gap-4 items-center group hover:bg-white dark:hover:bg-white/10 hover:border-brand-start/50"
      >
        <div className="relative overflow-hidden rounded-2xl w-28 h-28 flex-shrink-0 bg-slate-100 dark:bg-white/5">
           <img 
              src={imgError ? fallbackImage : images[0]} 
              alt={equipment.name} 
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              referrerPolicy="no-referrer" 
            />
             <div className={`absolute top-2 right-2 px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-[0.2em] shadow-lg backdrop-blur-md border border-white/20 ${
                equipment.type === 'facility' 
                  ? 'bg-brand-start/90 text-white' 
                  : 'bg-brand-end/90 text-white'
              }`}>
                {equipment.type}
              </div>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-blue-700 dark:text-brand-start uppercase tracking-[0.2em] mb-1">{equipment.department}</p>
              <h3 className="text-base font-display font-bold text-slate-950 dark:text-white line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-brand-start transition-colors leading-tight">{equipment.name}</h3>
              {equipment.type === 'facility' && equipment.labName && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">{equipment.labName}</p>}
            </div>
            
            <div className="flex flex-col items-start sm:items-end gap-2 text-xs w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", isAvailable ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600')} />
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", isAvailable ? 'text-slate-600 dark:text-slate-400' : 'text-rose-600 dark:text-rose-500')}>
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                </div>
                {equipment.facultyInCharge && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                    <User size={14} />
                    <span>{equipment.facultyInCharge}</span>
                  </div>
                )}
            </div>
        </div>

      </Card>
    );
  }

  return (
    <Card
      className="p-3 cursor-pointer transition-all duration-700 flex flex-col h-full group hover:bg-white dark:hover:bg-white/10 hover:-translate-y-2 hover:glow-brand"
    >
      <div className="relative overflow-hidden rounded-xl mb-3 aspect-[16/9] bg-slate-100 dark:bg-white/5">
        <AnimatePresence mode="wait">
          <motion.img 
            key={images[0]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={imgError ? fallbackImage : images[0]} 
            alt={equipment.name} 
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0" 
            referrerPolicy="no-referrer" 
          />
        </AnimatePresence>
        
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span className={`px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-[0.2em] shadow-lg backdrop-blur-md border border-white/20 ${
            equipment.type === 'facility' 
              ? 'bg-brand-start/90 text-white' 
              : 'bg-brand-end/90 text-white'
          }`}>
            {equipment.type}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-3">
          <p className="text-[10px] font-bold text-blue-700 dark:text-brand-start uppercase tracking-[0.2em] mb-1">{equipment.department}</p>
          <h3 className="text-base font-display font-bold text-slate-950 dark:text-white line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-brand-start transition-colors leading-tight">{equipment.name}</h3>
        </div>
        
        <div className="space-y-2 flex-1">
          {equipment.type === 'facility' && equipment.labName && (
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg group-hover:bg-brand-start/10 transition-colors">
                <Building2 size={12} className="text-blue-700 dark:text-brand-start" />
              </div>
              <span className="truncate font-bold">{equipment.labName}</span>
            </div>
          )}
          {equipment.facultyInCharge && (
             <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg group-hover:bg-brand-start/10 transition-colors">
                <User size={12} className="text-blue-700 dark:text-brand-start" />
              </div>
              <span className="truncate font-bold">{equipment.facultyInCharge}</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isAvailable ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600')} />
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", isAvailable ? 'text-slate-600 dark:text-slate-400' : 'text-rose-600 dark:text-rose-500')}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-950 dark:text-white group-hover:text-blue-700 dark:group-hover:text-brand-start transition-colors flex items-center gap-2">
            Details
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-start group-hover:text-white transition-all duration-500 group-hover:rotate-[360deg]">
              <Activity size={12} />
            </div>
          </span>
        </div>
      </div>
    </Card>
  );
}
