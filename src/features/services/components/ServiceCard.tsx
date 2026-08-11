'use client';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Edit, Trash2, ChevronDown, Beaker } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Service } from '../../../shared/types';
import { cn } from '@/shared/utils/cn';
import { useUpdateService } from '../hooks/useServices';
import { Switch } from '../../../components/ui/switch';


const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

interface ServiceCardProps {
  service: Service;
  isAdmin?: boolean;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
  key?: string;
  defaultOpen?: boolean;
}

export function ServiceCard({ service, isAdmin, onEdit, onDelete, defaultOpen = !isAdmin }: ServiceCardProps) {
  const [isEquipmentsVisible, setIsEquipmentsVisible] = useState(defaultOpen);
  const updateService = useUpdateService();

  const handleToggleAvailability = (equipmentIndex: number, newIsAvailable: boolean) => {
    if (!service.equipments || !isAdmin) return;

    const updatedEquipments = [...service.equipments];
    const equipmentToUpdate = { ...updatedEquipments[equipmentIndex] };
    equipmentToUpdate.isAvailable = newIsAvailable;
    updatedEquipments[equipmentIndex] = equipmentToUpdate;
    
    updateService.mutate({ id: service.id, data: { equipments: updatedEquipments } });
  };

  const hasEquipments = service.equipments && service.equipments.length > 0;

  return (
      <Card className="p-6 border-l-4 border-l-brand-end bg-slate-50 dark:bg-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-end/5 blur-[100px] -z-10 group-hover:bg-brand-end/10 transition-colors duration-700" />
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">{service.serviceName}</h3>
              <span className="px-4 py-1 bg-brand-end/10 text-brand-end text-[10px] font-bold rounded-full uppercase tracking-widest border border-brand-end/20">
                {service.equipments?.length || 0} Equipments
              </span>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 font-light mb-4 flex items-center gap-3 text-base">
              <MapPin size={16} className="text-brand-end" />
              {service.department}
            </p>

            {service.suitableDates && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block">Suitable Dates</span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">{service.suitableDates}</p>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex md:flex-col gap-3">
              <button
                onClick={() => onEdit?.(service)}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/5 text-sm"
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                onClick={() => onDelete?.(service.id)}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-rose-500/10 text-rose-500 font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 text-sm"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          )}
        </div>
        
        {isAdmin && hasEquipments && (
          <button
            onClick={() => setIsEquipmentsVisible(prev => !prev)}
            className="w-full flex items-center justify-center gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/5 cursor-pointer text-brand-end font-bold text-sm"
          >
            <span>{isEquipmentsVisible ? 'Hide' : 'Show'} Equipment</span>
            <ChevronDown size={18} className={cn('transition-transform', isEquipmentsVisible && 'rotate-180')} />
          </button>
        )}
        
        {isEquipmentsVisible && (
           hasEquipments ? (
            <div className="space-y-3 pt-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">Service Inventory</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
              </div>
              {service.equipments.map((equipment, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <img 
                    src={(equipment.images && equipment.images[0]) || PLACEHOLDER_IMAGE}
                    alt={equipment.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{equipment.name}</p>
                    {equipment.utilizationRate && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Utilization: <span className="font-semibold">{equipment.utilizationRate}</span></p>}
                  </div>

                  <div className="flex items-center gap-3">
                    {isAdmin ? (
                      <>
                        <Switch
                          checked={equipment.isAvailable ?? true}
                          onCheckedChange={(newVal) => handleToggleAvailability(index, newVal)}
                          disabled={updateService.isPending}
                        />
                        <span className={cn(
                          "text-xs font-bold uppercase tracking-wider w-20 text-center",
                          (equipment.isAvailable ?? true) ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {(equipment.isAvailable ?? true) ? "Available" : "Unavailable"}
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", (equipment.isAvailable ?? true) ? 'bg-emerald-600' : 'bg-rose-600')} />
                        <span className={cn(
                          "text-xs font-bold uppercase tracking-wider",
                          (equipment.isAvailable ?? true) ? 'text-slate-600 dark:text-slate-400' : 'text-rose-600 dark:text-rose-500'
                        )}>
                          {(equipment.isAvailable ?? true) ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 mt-8">
              <p className="text-slate-400 dark:text-slate-500 font-light italic">No equipment listed for this service.</p>
            </div>
          )
        )}
      </Card>
  );
}
