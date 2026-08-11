'use client';
import React from 'react';
import { useFieldArray, Control, UseFormRegister, Controller } from 'react-hook-form';
import { Plus, Minus, Beaker } from 'lucide-react';
import { ImageUpload } from '../../../shared/components/ImageUpload';
import { Switch } from '../../../components/ui/switch';

interface EquipmentInputsProps {
  control: any;
  register: UseFormRegister<any>;
  errors?: any;
}

export function EquipmentInputs({ control, register, errors }: EquipmentInputsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "equipments"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Beaker size={18} className="text-slate-500 dark:text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Equipments</h3>
        </div>
        <button
          type="button"
          onClick={() => append({ name: "", images: [], isAvailable: true, tags: '' })}
          className="flex items-center gap-1 text-xs font-bold text-brand-start hover:text-brand-end transition-colors"
        >
          <Plus size={14} />
          Add Equipment
        </button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-4 relative">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
              title="Remove Equipment"
            >
              <Minus size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Equipment Name</label>
                <input
                  {...register(`equipments.${index}.name` as const)}
                  placeholder="e.g. Compression Testing Machine"
                  className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all"
                />
                {errors?.equipments?.[index]?.name && (
                  <p className="text-xs text-rose-500 mt-1">{errors.equipments[index].name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tags / Categories (comma separated)</label>
                <input
                  {...register(`equipments.${index}.tags` as const)}
                  placeholder="e.g. Mechanical, Testing"
                  className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Short Description</label>
                <textarea
                  {...register(`equipments.${index}.description` as const)}
                  placeholder="Brief description of the equipment..."
                  rows={2}
                  className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all resize-none"
                />
              </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Controller
                  name={`equipments.${index}.images` as const}
                  control={control}
                  render={({ field }) => (
                    <ImageUpload 
                      images={field.value || []} 
                      onChange={field.onChange} 
                      label="Equipment Images" 
                    />
                  )}
                />
                {errors?.equipments?.[index]?.images && (
                  <p className="text-xs text-rose-500 font-medium mt-2">{String(errors.equipments[index].images.message)}</p>
                )}
              </div>
               <div className="space-y-2 self-center">
                 <Controller
                  name={`equipments.${index}.isAvailable`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50">
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        id={`isAvailable-${index}`}
                      />
                      <label htmlFor={`isAvailable-${index}`} className="font-bold text-slate-900 dark:text-white">
                        {field.value ?? true ? "Available" : "Unavailable"}
                      </label>
                    </div>
                  )}
                />
               </div>
            </div>
          </div>
        ))}
        
        {fields.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4 bg-slate-100 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
            No equipment added yet. Click "+ Add Equipment" to start.
          </p>
        )}
      </div>
    </div>
  );
}
