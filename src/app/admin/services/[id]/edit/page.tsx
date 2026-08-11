import { servicesApi } from '@/features/services/api';
import { EditServiceClientPage } from '@/features/services/components/EditServiceClientPage';

export async function generateStaticParams() {
  try {
    const services = await servicesApi.getAll();
    return services.map((service) => ({
      id: service.id,
    }));
  } catch (error) {
    console.error('Failed to generate static params for services edit', error);
    return [];
  }
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditServiceClientPage id={id} />;
}
