'use client';
import { FacilityForm } from '@/features/facilities/components/FacilityForm';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import { useRouter } from 'next/navigation';

export default function NewFacilityPage() {
  const router = useRouter();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin?tab=facility' },
    { label: 'Facilities', href: '/admin?tab=facility' },
    { label: 'New' }
  ];

  return (
    <PageContainer>
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader
        title="Add New Facility"
        description="Create a new facility or laboratory to be listed in the portal."
      />
      <FacilityForm
        onSuccess={() => router.push('/admin?tab=facility')}
        onCancel={() => router.push('/admin?tab=facility')}
      />
    </PageContainer>
  );
}
