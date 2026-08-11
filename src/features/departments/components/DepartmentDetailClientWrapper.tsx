'use client';
import React, { Suspense } from 'react';
import { useDepartment } from '../hooks/useDepartments';
import { useEquipmentList } from '@/features/infrastructure/hooks/useEquipmentList';
import DepartmentDetailClientPage from './DepartmentDetailClientPage';
import { BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import { Loader2 } from 'lucide-react';

function DepartmentDetailContent({ id }: { id: string }) {
  const { data: department, isLoading: isDeptLoading } = useDepartment(id);
  const { data: allEquipment, isLoading: isEqLoading } = useEquipmentList();

  const isLoading = isDeptLoading || isEqLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-start" size={48} />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Department Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400">The requested department could not be found or may have been removed.</p>
      </div>
    );
  }

  const departmentEquipment = (allEquipment || []).filter(eq => eq.deptId === id);
  const facilityEquipment = departmentEquipment.filter(eq => eq.type === 'facility');
  const serviceEquipment = departmentEquipment.filter(eq => eq.type === 'service');

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Departments", href: "/departments" },
    { label: department.name }
  ];

  return (
    <DepartmentDetailClientPage
      department={department}
      facilityEquipment={facilityEquipment}
      serviceEquipment={serviceEquipment}
      departmentEquipment={departmentEquipment}
      breadcrumbs={breadcrumbs}
    />
  );
}

export function DepartmentDetailClientWrapper({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-start" size={48} /></div>}>
      <DepartmentDetailContent id={id} />
    </Suspense>
  );
}
