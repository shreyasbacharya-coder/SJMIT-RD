
import { departmentsApi } from '@/features/departments/api';
import { facilitiesApi } from '@/features/facilities/api';
import { servicesApi } from '@/features/services/api';
import DepartmentDetailClientPage from '@/features/departments/components/DepartmentDetailClientPage';
import { UnifiedEquipment } from '@/features/infrastructure/hooks/useEquipmentList';
import { notFound } from 'next/navigation';
import { BreadcrumbItem } from '@/shared/components/Breadcrumbs';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

export async function generateStaticParams() {
    try {
        const departments = await departmentsApi.getAll();
        return departments.map((department) => ({
            id: department.id,
        }));
    } catch (error) {
        console.error("Failed to generate static params for departments", error);
        return [];
    }
}

async function getDepartmentPageData(id: string) {
    let department;
    try {
        department = await departmentsApi.getById(id);
    } catch (e) {
        notFound();
    }
    if (!department) notFound();

    const [facilities, services, allDepartments] = await Promise.all([
        facilitiesApi.getAll(),
        servicesApi.getAll(),
        departmentsApi.getAll()
    ]);
    
    const equipmentList: UnifiedEquipment[] = [];

    if (facilities && allDepartments) {
        facilities.forEach(facility => {
        (facility.equipments || []).forEach((eq, index) => {
            const dept = allDepartments.find(d => d.id === facility.deptId);
            
            const validEqImages = (eq.images || []).filter(Boolean);
            const finalImages = validEqImages.length > 0 ? validEqImages : (dept?.image ? [dept.image] : [PLACEHOLDER_IMAGE]);
    
            equipmentList.push({
              id: `facility-${facility.id}-${eq.id}`,
              name: eq.name,
              department: facility.department || 'Unknown Department',
              deptId: facility.deptId,
              type: 'facility',
              imageUrl: finalImages[0],
              images: finalImages,
              labName: facility.labName,
              facultyInCharge: facility.facultyInCharge,
              researchFocus: facility.researchFocus,
              email: facility.email || dept?.email,
              contact: facility.contact,
              description: eq.description,
              tags: eq.tags,
              isAvailable: eq.isAvailable,
              hod: dept?.hod,
            });
          });
        });
    }

    if (services && allDepartments) {
        services.forEach(service => {
          (service.equipments || []).forEach((eq, index) => {
            const dept = allDepartments.find(d => d.id === service.deptId);
    
            const validEqImages = (eq.images || []).filter(Boolean);
            const finalImages = validEqImages.length > 0 ? validEqImages : (dept?.image ? [dept.image] : [PLACEHOLDER_IMAGE]);
            
            equipmentList.push({
              id: `service-${service.id}-${eq.id}`,
              name: eq.name,
              department: service.department || 'Unknown Department',
              deptId: service.deptId,
              type: 'service',
              imageUrl: finalImages[0],
              images: finalImages,
              serviceName: service.serviceName,
              utilizationRate: eq.utilizationRate,
              suitableDates: service.suitableDates,
              description: eq.description,
              tags: eq.tags,
              isAvailable: eq.isAvailable,
              hod: dept?.hod,
            });
          });
        });
    }
    
    equipmentList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const departmentEquipment = equipmentList.filter(eq => eq.deptId === id);
    const facilityEquipment = departmentEquipment.filter(eq => eq.type === 'facility');
    const serviceEquipment = departmentEquipment.filter(eq => eq.type === 'service');

    return { department, facilityEquipment, serviceEquipment, departmentEquipment };
}

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { department, facilityEquipment, serviceEquipment, departmentEquipment } = await getDepartmentPageData(id);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Departments", href: "/departments" },
        { label: department.name }
    ];
    
    return <DepartmentDetailClientPage 
        department={department} 
        facilityEquipment={facilityEquipment} 
        serviceEquipment={serviceEquipment} 
        departmentEquipment={departmentEquipment} 
        breadcrumbs={breadcrumbs}
    />
}
