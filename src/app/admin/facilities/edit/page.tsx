'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EditFacilityClientPage } from '@/features/facilities/components/EditFacilityClientPage';
import { Loader2 } from 'lucide-react';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';

function EditFacilityContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <PageContainer>
        <PageHeader title="Error" description="No facility ID provided." />
      </PageContainer>
    );
  }

  return <EditFacilityClientPage id={id} />;
}

export default function EditFacilityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-start" size={48} />
      </div>
    }>
      <EditFacilityContent />
    </Suspense>
  );
}
