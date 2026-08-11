'use client';
import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useEquipmentList } from '@/features/infrastructure/hooks/useEquipmentList';
import { EquipmentDetailPage } from './EquipmentDetailPage';
import { BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import { Loader2 } from 'lucide-react';

function EquipmentDetailContent({ id }: { id: string }) {
  const { data: equipmentList, isLoading } = useEquipmentList();
  const equipment = equipmentList?.find(eq => eq.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-start" size={48} />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Equipment Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400">The requested equipment could not be found or may have been removed.</p>
      </div>
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Infrastructure", href: "/infrastructure" },
    { label: equipment.name }
  ];

  return <EquipmentDetailPage equipment={equipment} breadcrumbs={breadcrumbs} />;
}

export function EquipmentDetailClientWrapper({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-start" size={48} /></div>}>
      <EquipmentDetailContent id={id} />
    </Suspense>
  );
}
