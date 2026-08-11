import { useQuery } from '@tanstack/react-query';
import { useFacilities } from '../../facilities/hooks/useFacilities';
import { useServices } from '../../services/hooks/useServices';
import { useDepartments } from '../../departments/hooks/useDepartments';

export type UnifiedEquipment = {
  id: string;
  name: string;
  department: string;
  deptId: string;
  type: 'facility' | 'service';
  imageUrl: string;
  images: string[];
  isAvailable?: boolean;
  
  // Facility specific
  labName?: string;
  facultyInCharge?: string;
  researchFocus?: string;
  email?: string;
  contact?: string;
  description?: string;
  tags?: string[];
  
  // Service specific
  serviceName?: string;
  utilizationRate?: string;
  suitableDates?: string;

  // Department level info
  hod?: string;
};

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

export function useEquipmentList() {
  const { data: facilities, isLoading: isFacilitiesLoading } = useFacilities();
  const { data: services, isLoading: isServicesLoading } = useServices();
  const { data: departments, isLoading: isDeptsLoading } = useDepartments();

  const isLoading = isFacilitiesLoading || isServicesLoading || isDeptsLoading;

  const equipmentList: UnifiedEquipment[] = [];

  if (facilities && departments) {
    facilities.forEach(facility => {
      (facility.equipments || []).forEach((eq) => {
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
          contact: facility.contact,
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
      (service.equipments || []).forEach((eq) => {
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

  // Sort alphabetically by name
  equipmentList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return {
    data: equipmentList,
    isLoading,
  };
}
