'use client';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2 } from 'lucide-react';
import { useAddFacility, useUpdateFacility } from '../hooks/useFacilities';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { EquipmentInputs } from './EquipmentInputs';
import { Facility } from '../../../shared/types';
import { ImageUpload } from '../../../shared/components/ImageUpload';

const schema = z.object({
  deptId: z.string().min(1, 'Department is required'),
  labName: z.string().min(2, 'Lab name is required'),
  facultyInCharge: z.string().optional(),
  researchFocus: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  contact: z.string().regex(/^\d*$/, 'Only digits allowed').optional().or(z.literal('')),
  equipments: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Equipment name is required'),
    description: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    tags: z.string().optional(),
    isAvailable: z.boolean().optional(),
  })).min(1, 'At least one equipment is required.'),
});

type FormData = z.infer<typeof schema>;

interface FacilityFormProps {
  initialData?: Facility | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FacilityForm({ initialData, onSuccess, onCancel }: FacilityFormProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      deptId: '',
      labName: '',
      equipments: []
    }
  });

  useEffect(() => {
    if (initialData) {
      const equipmentsData = (initialData.equipments && initialData.equipments.length > 0)
        ? initialData.equipments.map(e => ({
            id: e.id,
            name: e.name,
            description: e.description || '',
            images: e.images || [],
            tags: (Array.isArray(e.tags) ? e.tags.join(', ') : e.tags) || '',
            isAvailable: e.isAvailable ?? true,
          }))
        : [];

      reset({
        deptId: initialData.deptId,
        labName: initialData.labName,
        facultyInCharge: initialData.facultyInCharge || '',
        researchFocus: initialData.researchFocus || '',
        email: initialData.email || '',
        contact: initialData.contact || '',
        equipments: equipmentsData,
      });
    } else {
      reset({
        deptId: '',
        labName: '',
        facultyInCharge: '',
        researchFocus: '',
        email: '',
        contact: '',
        equipments: [{ name: "", description: "", images: [], tags: "", isAvailable: true }],
      });
    }
  }, [initialData, reset]);

  const { data: departments } = useDepartments();
  const addFacility = useAddFacility();
  const updateFacility = useUpdateFacility();

  const onSubmit = (data: FormData) => {
    const selectedDept = departments?.find(d => d.id === data.deptId);
    const formattedData = {
      ...data,
      department: selectedDept?.name || '',
      equipments: data.equipments.map(e => ({
        id: e.id || `eq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: e.name,
        description: e.description || '',
        images: e.images || [],
        tags: e.tags ? e.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        isAvailable: e.isAvailable ?? true,
      }))
    };

    if (initialData) {
      updateFacility.mutate({ id: initialData.id, data: formattedData }, {
        onSuccess: () => {
          onSuccess?.();
        }
      });
    } else {
      addFacility.mutate(formattedData, {
        onSuccess: () => {
          reset();
          onSuccess?.();
        }
      });
    }
  };

  const isPending = addFacility.isPending || updateFacility.isPending;

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
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Facility / Lab Name</label>
          <input 
            {...register('labName')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.labName && <p className="text-xs text-rose-500 font-medium">{errors.labName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Faculty In-Charge</label>
          <input 
            {...register('facultyInCharge')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.facultyInCharge && <p className="text-xs text-rose-500 font-medium">{errors.facultyInCharge.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Research Focus</label>
          <input 
            {...register('researchFocus')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.researchFocus && <p className="text-xs text-rose-500 font-medium">{errors.researchFocus.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Email</label>
          <input 
            {...register('email')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Contact</label>
          <input 
            {...register('contact')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.contact && <p className="text-xs text-rose-500 font-medium">{errors.contact.message}</p>}
        </div>
      </div>

      <div className="pt-10 border-t border-slate-200 dark:border-white/5">
        <EquipmentInputs control={control} register={register} errors={errors} />
        {errors.equipments?.root && <p className="text-sm text-rose-500 font-medium mt-4">{errors.equipments.root.message}</p>}
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
          <span className="font-bold">{initialData ? 'Update Facility' : 'Save Facility'}</span>
        </button>
      </div>
    </form>
  );
}
