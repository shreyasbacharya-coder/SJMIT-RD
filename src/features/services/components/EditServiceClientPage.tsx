'use client';
import React, { Suspense } from 'react';
import { ServiceForm } from '@/features/services/components/ServiceForm';
import { useService } from '@/features/services/hooks/useServices';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function EditServiceFormContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: service, isLoading } = useService(id);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin?tab=service' },
    { label: 'Services', href: '/admin?tab=service' },
    { label: service?.serviceName || '...' },
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
        title="Edit Service"
        description={`Editing details for ${service?.serviceName || 'service'}.`}
      />
      <ServiceForm
        initialData={service}
        onSuccess={() => router.push('/admin?tab=service')}
        onCancel={() => router.push('/admin?tab=service')}
      />
    </PageContainer>
  );
}

export function EditServiceClientPage({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-start" size={48} /></div>}>
      <EditServiceFormContent id={id} />
    </Suspense>
  );
}
