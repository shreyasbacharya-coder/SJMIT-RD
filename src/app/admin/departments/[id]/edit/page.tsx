import { departmentsApi } from '@/features/departments/api';
import { EditDepartmentClientPage } from '@/features/departments/components/EditDepartmentClientPage';

export async function generateStaticParams() {
  try {
    const departments = await departmentsApi.getAll();
    return departments.map((department) => ({
      id: department.id,
    }));
  } catch (error) {
    console.error('Failed to generate static params for departments edit', error);
    return [];
  }
}

export default async function EditDepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditDepartmentClientPage id={id} />;
}
