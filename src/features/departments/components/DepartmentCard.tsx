'use client';
import { useRouter } from 'next/navigation';
import { Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Department } from '../../../shared/types';

interface DepartmentCardProps {
  department: Department;
  key?: string;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const router = useRouter();

  return (
    <Card 
      onClick={() => router.push(`/departments/${department.id}`)}
      className="group p-0 glass-card hover:border-brand-start/50 transition-all duration-500 cursor-pointer rounded-3xl overflow-hidden"
    >
      <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        {department.image ? (
          <img 
            src={department.image} 
            alt={department.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/10">
            <Users size={64} />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
            <h3 className="text-xl font-display font-bold tracking-tight mb-1">
                {department.name}
            </h3>
            <p className="text-white/70 font-medium mt-1 uppercase tracking-widest text-[10px]">
                HOD: {department.hod || 'N/A'}
            </p>
        </div>

        <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-white/20">
            <ArrowRight size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );
}
