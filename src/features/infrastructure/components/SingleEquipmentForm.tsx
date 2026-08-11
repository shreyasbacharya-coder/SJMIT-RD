'use client';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/shared/components/ImageUpload';
import { Switch } from '@/components/ui/switch';
import { useAddFacilityEquipment, useUpdateFacilityEquipment } from '@/features/facilities/hooks/useFacilities';
import { useAddServiceEquipment, useUpdateServiceEquipment } from '@/features/services/hooks/useServices';
import { FacilityEquipment, ServiceEquipment } from '@/shared/types';

const facilityEquipmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Equipment name is required'),
  description: z.string().optional(),
  utilizationRate: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

const serviceEquipmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Equipment name is required'),
  description: z.string().optional(),
  utilizationRate: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

interface SingleEquipmentFormProps {
  type: 'facility' | 'service';
  parentId: string;
  initialData?: FacilityEquipment | ServiceEquipment;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SingleEquipmentForm({ type, parentId, initialData, onSuccess, onCancel }: SingleEquipmentFormProps) {
  const isFacility = type === 'facility';
  const schema = isFacility ? facilityEquipmentSchema : serviceEquipmentSchema;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        images: [],
        tags: '',
        isAvailable: true,
        ...(isFacility ? {} : { utilizationRate: '' })
      });
    }
  }, [initialData, reset, isFacility]);

  const addFacilityEquipment = useAddFacilityEquipment();
  const updateFacilityEquipment = useUpdateFacilityEquipment();
  const addServiceEquipment = useAddServiceEquipment();
  const updateServiceEquipment = useUpdateServiceEquipment();

  const isPending = addFacilityEquipment.isPending || updateFacilityEquipment.isPending || addServiceEquipment.isPending || updateServiceEquipment.isPending;

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((s:string) => s.trim()).filter(Boolean) : [],
    };

    if (initialData) { // Handle Update
      if (isFacility) {
        updateFacilityEquipment.mutate({ facilityId: parentId, equipment: formattedData as FacilityEquipment }, {
          onSuccess: () => onSuccess?.(),
        });
      } else {
        updateServiceEquipment.mutate({ serviceId: parentId, equipment: formattedData as ServiceEquipment }, {
          onSuccess: () => onSuccess?.(),
        });
      }
    } else { // Handle Create
      const { id, ...createData } = formattedData;
      if (isFacility) {
        addFacilityEquipment.mutate({ facilityId: parentId, equipment: createData }, {
          onSuccess: () => onSuccess?.()
        });
      } else {
        addServiceEquipment.mutate({ serviceId: parentId, equipment: createData }, {
          onSuccess: () => onSuccess?.()
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Equipment Name</label>
          <input 
            {...register('name')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message as string}</p>}
        </div>

        {!isFacility && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Utilization Rate</label>
            <input 
              {...register('utilizationRate')} 
              className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
            />
            {errors.utilizationRate && <p className="text-xs text-rose-500 font-medium">{errors.utilizationRate.message as string}</p>}
          </div>
        )}
        
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all"
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Tags (comma-separated)</label>
          <input
            {...register('tags')}
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all"
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ImageUpload 
                images={field.value || []} 
                onChange={field.onChange} 
                label="Equipment Images" 
              />
            )}
          />
        </div>

        <div className="space-y-2 self-center">
          <Controller
            name="isAvailable"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-100 dark:bg-white/5">
                <Switch
                  checked={field.value ?? true}
                  onCheckedChange={field.onChange}
                  id="isAvailable"
                />
                <label htmlFor="isAvailable" className="font-bold text-slate-900 dark:text-white">
                  {field.value ?? true ? "Available" : "Unavailable"}
                </label>
              </div>
            )}
          />
        </div>
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
          <span className="font-bold">{initialData ? 'Update Equipment' : 'Add Equipment'}</span>
        </button>
      </div>
    </form>
  );
}
