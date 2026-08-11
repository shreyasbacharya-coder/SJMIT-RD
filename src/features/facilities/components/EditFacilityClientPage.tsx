'use client';
import React, { Suspense } from 'react';
import { FacilityForm } from '@/features/facilities/components/FacilityForm';
import { useFacility } from '@/features/facilities/hooks/useFacilities';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function EditFacilityFormContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: facility, isLoading } = useFacility(id);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin?tab=facility' },
    { label: 'Facilities', href: '/admin?tab=facility' },
    { label: facility?.labName || '...' },
    { label: 'Edit' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-start" size={48} />
      </div>
    );
  }

  return (
    <PageContainer>
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader
        title="Edit Facility"
        description={`Editing details for ${facility?.labName || 'facility'}.`}
      />
      <FacilityForm
        initialData={facility}
        onSuccess={() => router.push('/admin?tab=facility')}
        onCancel={() => router.push('/admin?tab=facility')}
      />
    </PageContainer>
  );
}

export function EditFacilityClientPage({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-start" size={48} /></div>}>
      <EditFacilityFormContent id={id} />
    </Suspense>
  );
}
