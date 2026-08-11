import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2 } from 'lucide-react';
import { useAddDepartment, useUpdateDepartment } from '../hooks/useDepartments';
import { Department } from '../../../shared/types';
import { ImageUpload } from '../../../shared/components/ImageUpload';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  hod: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  image: z.string().url('A valid image URL is required. Please upload an image.').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface DepartmentFormProps {
  initialData?: Department | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DepartmentForm({ initialData, onSuccess, onCancel }: DepartmentFormProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const addDept = useAddDepartment();
  const updateDept = useUpdateDepartment();

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        hod: initialData.hod || '',
        email: initialData.email || '',
        image: initialData.image || '',
      });
    } else {
      reset({
        name: '',
        hod: '',
        email: '',
        image: '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
    };
    
    if (initialData) {
      updateDept.mutate({ id: initialData.id, data: formattedData }, {
        onSuccess: () => {
          onSuccess?.();
        }
      });
    } else {
      addDept.mutate(formattedData, {
        onSuccess: () => {
          reset();
          onSuccess?.();
        }
      });
    }
  };

  const isPending = addDept.isPending || updateDept.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Department Name</label>
          <input 
            {...register('name')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">HOD / Coordinator</label>
          <input 
            {...register('hod')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.hod && <p className="text-xs text-rose-500 font-medium">{errors.hod.message}</p>}
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Email</label>
          <input 
            {...register('email')} 
            className="w-full px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-start outline-none text-slate-900 dark:text-white transition-all" 
          />
          {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
        </div>
        <div className="md:col-span-2 space-y-2">
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload 
                images={field.value ? [field.value] : []} 
                onChange={(urls) => field.onChange(urls[0] || '')} 
                label="Department Image" 
                maxImages={1}
              />
            )}
          />
          {errors.image && <p className="text-xs text-rose-500 font-medium mt-2">{String(errors.image.message)}</p>}
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
          <span className="font-bold">{initialData ? 'Update Department' : 'Save Department'}</span>
        </button>
      </div>
    </form>
  );
}
