'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EditServiceClientPage } from '@/features/services/components/EditServiceClientPage';
import { Loader2 } from 'lucide-react';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';

function EditServiceContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <PageContainer>
        <PageHeader title="Error" description="No service ID provided." />
      </PageContainer>
    );
  }

  return <EditServiceClientPage id={id} />;
}

export default function EditServicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-start" size={48} />
      </div>
    }>
      <EditServiceContent />
    </Suspense>
  );
}
