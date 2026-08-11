'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { useFacility } from '@/features/facilities/hooks/useFacilities';
import { useService } from '@/features/services/hooks/useServices';
import { Loader2 } from 'lucide-react';
import { SingleEquipmentForm } from '@/features/infrastructure/components/SingleEquipmentForm';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';

function NewSingleEquipmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as 'facility' | 'service';
  const parentId = searchParams.get('parentId');

  const { data: facility, isLoading: facilityLoading } = useFacility(
    type === 'facility' ? (parentId ?? undefined) : undefined
  );
  const { data: service, isLoading: serviceLoading } = useService(
    type === 'service' ? (parentId ?? undefined) : undefined
  );

  if (!parentId || !type) {
    return (
      <PageContainer>
        <PageHeader title="Error" description="Invalid new equipment link." />
      </PageContainer>
    );
  }

  const isLoading = facilityLoading || serviceLoading;
  const parent = type === 'facility' ? facility : service;
  
  const parentName = type === 'facility' ? facility?.labName : service?.serviceName;
  const backHref = `/admin?tab=${type}`;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    { label: type === 'facility' ? 'Facilities' : 'Services', href: backHref },
    { label: parentName || '...' },
    { label: 'Add Equipment' }
  ];

  return (
    <PageContainer>
        <Breadcrumbs items={breadcrumbs} />
        <PageHeader
            title={`Add New Equipment`}
            description={`Adding new equipment to ${parentName || 'parent'}.`}
        />
        {isLoading ? (
            <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-brand-start" size={32} />
            </div>
        ) : parent ? (
            <SingleEquipmentForm
                type={type}
                parentId={parentId}
                onSuccess={() => router.push(backHref)}
                onCancel={() => router.push(backHref)}
            />
        ) : (
            <p>Parent not found.</p>
        )}
    </PageContainer>
  );
}

export default function NewSingleEquipmentPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading equipment form...</div>}>
      <NewSingleEquipmentContent />
    </React.Suspense>
  );
}
