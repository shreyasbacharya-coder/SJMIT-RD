'use client';
import React, { Suspense } from 'react';
import { DepartmentForm } from '@/features/departments/components/DepartmentForm';
import { useDepartment } from '@/features/departments/hooks/useDepartments';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';

function EditDepartmentFormContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: department, isLoading } = useDepartment(id);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin?tab=department' },
    { label: 'Departments', href: '/admin?tab=department' },
    { label: department?.name || '...', href: `/admin/departments?id=${id}` },
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
        title="Edit Department"
        description={`Editing details for ${department?.name || 'department'}.`}
      />
      <DepartmentForm
        initialData={department}
        onSuccess={() => router.push('/admin?tab=department')}
        onCancel={() => router.push('/admin?tab=department')}
      />
    </PageContainer>
  );
}

export function EditDepartmentClientPage({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-start" size={48} /></div>}>
      <EditDepartmentFormContent id={id} />
    </Suspense>
  );
}
