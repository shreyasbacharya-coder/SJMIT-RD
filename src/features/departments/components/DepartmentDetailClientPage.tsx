'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Department } from '@/shared/types';
import type { UnifiedEquipment } from '@/features/infrastructure/hooks/useEquipmentList';
import { PageContainer } from '@/shared/components/PageContainer';
import { Card } from '@/components/ui/card';
import { EquipmentGrid } from '@/features/infrastructure/components/EquipmentGrid';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import Link from 'next/link';

interface DepartmentDetailClientPageProps {
    department: Department;
    facilityEquipment: UnifiedEquipment[];
    serviceEquipment: UnifiedEquipment[];
    departmentEquipment: UnifiedEquipment[];
    breadcrumbs: BreadcrumbItem[];
}

export default function DepartmentDetailClientPage({ department, facilityEquipment, serviceEquipment, departmentEquipment, breadcrumbs }: DepartmentDetailClientPageProps) {
  
  return (
    <PageContainer>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-950 dark:text-white mb-4 tracking-tight">{department.name}</h1>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-slate-600 dark:text-slate-400 font-medium">
          <p><span className="text-white font-bold text-slate-900 dark:text-slate-300">HOD:</span> {department.hod}</p>
          <p><span className="text-white font-bold text-slate-900 dark:text-slate-300">Email:</span> {department.email}</p>
          <p><span className="text-white font-bold text-slate-900 dark:text-slate-300">Contact:</span> {department.contact}</p>
        </div>
      </div>
      
      <div className="space-y-16">
        {facilityEquipment.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-8 text-slate-900 dark:text-white border-b-4 border-brand-start pb-4">
              Facility Equipment
            </h2>
            <EquipmentGrid
              equipments={facilityEquipment}
              isLoading={false}
              view="grid"
            />
          </div>
        )}

        {serviceEquipment.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-8 text-slate-900 dark:text-white border-b-4 border-brand-end pb-4">
              Service Equipment
            </h2>
            <EquipmentGrid
              equipments={serviceEquipment}
              isLoading={false}
              view="grid"
            />
          </div>
        )}

        {departmentEquipment.length === 0 && (
           <Card className="text-center py-20 border-dashed">
            <p className="text-slate-500 dark:text-slate-400">No equipment listed for this department yet.</p>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
