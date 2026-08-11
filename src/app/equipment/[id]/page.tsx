import { departmentsApi } from '@/features/departments/api';
import { facilitiesApi } from '@/features/facilities/api';
import { servicesApi } from '@/features/services/api';
import { notFound } from 'next/navigation';
import { EquipmentDetailPage } from '@/features/infrastructure/components/EquipmentDetailPage';
import { UnifiedEquipment } from '@/features/infrastructure/hooks/useEquipmentList';
import { BreadcrumbItem } from '@/shared/components/Breadcrumbs';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

async function getAllEquipment(): Promise<UnifiedEquipment[]> {
    const [facilities, services, departments] = await Promise.all([
        facilitiesApi.getAll(),
        servicesApi.getAll(),
        departmentsApi.getAll()
    ]);
    
    const equipmentList: UnifiedEquipment[] = [];

    if (facilities && departments) {
        facilities.forEach(facility => {
          (facility.equipments || []).forEach((eq, index) => {
            const dept = departments.find(d => d.id === facility.deptId);
            
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
              contact: facility.contact || dept?.contact,
              description: eq.description,
              tags: eq.tags,
              isAvailable: eq.isAvailable,
              hod: dept?.hod,
            });
          });
        });
    }

    if (services && departments) {
        services.forEach(service => {
          (service.equipments || []).forEach((eq, index) => {
            const dept = departments.find(d => d.id === service.deptId);
    
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
              facultyInCharge: service.facultyInCharge,
              utilizationRate: eq.utilizationRate,
              suitableDates: service.suitableDates,
              email: service.email || dept?.email,
              contact: service.contact || dept?.contact,
              description: eq.description,
              tags: eq.tags,
              isAvailable: eq.isAvailable,
              hod: dept?.hod,
            });
          });
        });
    }
    
    return equipmentList;
}

export async function generateStaticParams() {
    try {
        const allEquipment = await getAllEquipment();
        return allEquipment.map((eq) => ({
            id: eq.id,
        }));
    } catch (error) {
        console.error("Failed to generate static params for equipment", error);
        return [];
    }
}


export default async function EquipmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const allEquipment = await getAllEquipment();
    const equipment = allEquipment.find(eq => eq.id === id);
    
    if (!equipment) {
        notFound();
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Infrastructure", href: "/infrastructure" },
      { label: equipment.name }
    ];

    return <EquipmentDetailPage equipment={equipment} breadcrumbs={breadcrumbs} />;
}
