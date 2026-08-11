'use client';
import { ServiceForm } from '@/features/services/components/ServiceForm';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import { useRouter } from 'next/navigation';

export default function NewServicePage() {
  const router = useRouter();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin?tab=service' },
    { label: 'Services', href: '/admin?tab=service' },
    { label: 'New' }
  ];

  return (
    <PageContainer>
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader
        title="Add New Service"
        description="Create a new service or consultancy to be listed in the portal."
      />
      <ServiceForm
        onSuccess={() => router.push('/admin?tab=service')}
        onCancel={() => router.push('/admin?tab=service')}
      />
    </PageContainer>
  );
}
