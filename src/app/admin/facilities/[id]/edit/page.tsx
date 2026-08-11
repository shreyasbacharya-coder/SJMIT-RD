import { facilitiesApi } from '@/features/facilities/api';
import { EditFacilityClientPage } from '@/features/facilities/components/EditFacilityClientPage';

export async function generateStaticParams() {
  try {
    const facilities = await facilitiesApi.getAll();
    return facilities.map((facility) => ({
      id: facility.id,
    }));
  } catch (error) {
    console.error('Failed to generate static params for facilities edit', error);
    return [];
  }
}

export default async function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditFacilityClientPage id={id} />;
}
