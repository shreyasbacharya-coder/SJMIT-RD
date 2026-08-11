'use client';
import { DepartmentForm } from '@/features/departments/components/DepartmentForm';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import { useRouter } from 'next/navigation';

export default function NewDepartmentPage() {
  const router = useRouter();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin?tab=department' },
    { label: 'Departments', href: '/admin?tab=department' },
    { label: 'New' }
  ];

  return (
    <PageContainer>
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader
        title="Add New Department"
        description="Create a new academic department to be listed in the portal."
      />
      <DepartmentForm
        onSuccess={() => router.push('/admin?tab=department')}
        onCancel={() => router.push('/admin?tab=department')}
      />
    </PageContainer>
  );
}
