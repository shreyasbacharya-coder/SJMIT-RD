'use client';
import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAddService, useUpdateService } from '../hooks/useServices';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { Service } from '../../../shared/types';
import { ImageUpload } from '../../../shared/components/ImageUpload';
import { Switch } from '../../../components/ui/switch';

const schema = z.object({
  deptId: z.string().min(1, 'Department is required'),
  suitableDates: z.string().optional(),
  equipments: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Equipment name is required'),
    description: z.string().optional(),
    utilizationRate: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    tags: z.string().optional(),
    isAvailable: z.boolean().optional(),
  })).min(1, 'At least one equipment is required'),
});

type FormData = z.infer<typeof schema>;

interface ServiceFormProps {
  initialData?: Service | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ServiceForm({ initialData, onSuccess, onCancel }: ServiceFormProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      deptId: '',
      suitableDates: '',
      equipments: []
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        deptId: initialData.deptId || '',
        suitableDates: initialData.suitableDates || '',
        equipments: (initialData.equipments && initialData.equipments.length > 0) 
          ? initialData.equipments.map(e => ({ 
              ...e,
              id: e.id, 
              images: e.images || [],
              description: e.description || '',
              tags: (Array.isArray(e.tags) ? e.tags.join(', ') : e.tags) || '',
              isAvailable: e.isAvailable ?? true
            }))
          : [],
      });
    } else {
      reset({
        deptId: '',
        suitableDates: '',
        equipments: [{ name: '', utilizationRate: '', images: [], description: '', tags: '', isAvailable: true }]
      });
    }
  }, [initialData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'equipments'
  });

  const { data: departments } = useDepartments();
  const addService = useAddService();
  const updateService = useUpdateService();

  const isPending = addService.isPending || updateService.isPending;

  const onSubmit = (data: FormData) => {
    const department = departments?.find(d => d.id === data.deptId)?.name || '';
    
    const formattedData = {
      ...data,
      department,
      equipments: data.equipments.map((e: any) => ({
        ...e,
        id: e.id || `eq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        images: e.images || [],
        tags: e.tags ? e.tags.split(',').map((s:string) => s.trim()).filter(Boolean) : [],
        isAvailable: e.isAvailable ?? true
      }))
    };
    
    if (initialData) {
      updateService.mutate({ id: initialData.id, data: formattedData }, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        }
      });
    } else {
      addService.mutate(formattedData, {
        onSuccess: () => {
          reset();
          if (onSuccess) onSuccess();
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Department</label>
          <select 
            {...register('deptId')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all appearance-none"
          >
            <option value="" className="bg-white dark:bg-[#0a0c10]">Select Department</option>
            {departments?.map(d => <option key={d.id} value={d.id} className="bg-white dark:bg-[#0a0c10]">{d.name}</option>)}
          </select>
          {errors.deptId && <p className="text-xs text-rose-500 font-medium">{errors.deptId.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Suitable Dates / Working Days</label>
          <input 
            {...register('suitableDates')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
            placeholder="e.g. Monday to Friday" 
          />
          {errors.suitableDates && <p className="text-xs text-rose-500 font-medium">{errors.suitableDates.message}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Equipments</h3>
          <button
            type="button"
            onClick={() => append({ name: '', description: '', utilizationRate: '', images: [], tags: '', isAvailable: true })}
            className="flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all text-xs uppercase tracking-widest border border-slate-200 dark:border-white/5"
          >
            <Plus size={14} />
            Add Equipment
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-6 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 relative group">
             <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all z-10"
                title="Remove Equipment"
              >
                <Trash2 size={20} />
              </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Equipment Name</label>
                <input
                  {...register(`equipments.${index}.name`)}
                  className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="e.g. Compression Testing Machine"
                />
                {errors.equipments?.[index]?.name && (
                  <p className="text-xs text-rose-500 font-medium">{errors.equipments[index]?.name?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Utilization Rate</label>
                <input
                  {...register(`equipments.${index}.utilizationRate`)}
                  className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="e.g. 25 hrs/week"
                />
                {errors.equipments?.[index]?.utilizationRate && (
                  <p className="text-xs text-rose-500 font-medium">{errors.equipments[index]?.utilizationRate?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Tags (comma separated)</label>
                <input
                  {...register(`equipments.${index}.tags`)}
                  className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="e.g. Testing, Mechanical"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Short Description</label>
              <textarea
                {...register(`equipments.${index}.description`)}
                rows={2}
                className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all resize-none"
                placeholder="Brief description of the equipment..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {errors.equipments?.[index]?.images && (
                <p className="text-xs text-rose-500 font-medium mt-2">{String(errors.equipments[index]?.images?.message)}</p>
              )}
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
        {errors.equipments?.root && (
          <p className="text-sm text-rose-500 font-medium mt-2">{errors.equipments.root.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-10 border-t border-slate-200 dark:border-white/5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={isPending}
          className="btn-primary"
        >
          {isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span className="font-bold">{initialData ? 'Update Service' : 'Save Service'}</span>
        </button>
      </div>
    </form>
  );
}
