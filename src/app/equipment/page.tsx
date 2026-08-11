'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EquipmentDetailClientWrapper } from '@/features/infrastructure/components/EquipmentDetailClientWrapper';
import { Loader2 } from 'lucide-react';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';

function EquipmentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <PageContainer>
        <PageHeader
          title={<>Equipment <span className="text-gradient">Not Found</span></>}
          description="No equipment ID was provided. Please navigate from the Infrastructure directory."
        />
      </PageContainer>
    );
  }

  return <EquipmentDetailClientWrapper id={id} />;
}

export default function EquipmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-start" size={48} />
      </div>
    }>
      <EquipmentContent />
    </Suspense>
  );
}
