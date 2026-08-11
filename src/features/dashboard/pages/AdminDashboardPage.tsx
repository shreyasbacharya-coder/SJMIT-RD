import React, { useMemo } from 'react';
import { useDepartments } from '@/features/departments/hooks/useDepartments';
import { useFacilities } from '@/features/facilities/hooks/useFacilities';
import { useServices } from '@/features/services/hooks/useServices';
import { Loader2 } from 'lucide-react';
import { DashboardStats } from '../components/DashboardStats';
import { DepartmentDistributionChart } from '../components/DepartmentDistributionChart';
import { AssetStatusChart } from '../components/AssetStatusChart';
import { AssetTypeChart } from '../components/AssetTypeChart';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className='space-y-2'>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3">
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <Skeleton className="aspect-square h-[250px] w-[250px] rounded-full" />
            </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <Skeleton className="aspect-square h-[250px] w-[250px] rounded-full" />
            </CardContent>
        </Card>
        <Card className="p-8">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data: departments, isLoading: deptsLoading, isFetching: deptsFetching } = useDepartments();
  const { data: facilities, isLoading: facilitiesLoading, isFetching: facilitiesFetching } = useFacilities();
  const { data: services, isLoading: servicesLoading, isFetching: servicesFetching } = useServices();

  const isLoading = 
    (deptsLoading || (deptsFetching && !departments)) ||
    (facilitiesLoading || (facilitiesFetching && !facilities)) ||
    (servicesLoading || (servicesFetching && !services));

  const stats = useMemo(() => {
    const facilityEquipmentCount = facilities?.reduce((acc, facility) => acc + (facility.equipments?.length || 0), 0) || 0;
    const serviceEquipmentCount = services?.reduce((acc, service) => acc + (service.equipments?.length || 0), 0) || 0;
    
    return {
      totalDepartments: departments?.length || 0,
      facilityEquipmentCount,
      serviceEquipmentCount,
      totalAssets: facilityEquipmentCount + serviceEquipmentCount,
    };
  }, [departments, facilities, services]);

  const departmentDistribution = useMemo(() => {
    if (!departments || !facilities || !services) return [];
    
    return departments.map(dept => {
      const facilityEquipCount = facilities
        .filter(f => f.deptId === dept.id)
        .reduce((sum, f) => sum + (f.equipments?.length || 0), 0);
        
      const serviceEquipCount = services
        .filter(s => s.deptId === dept.id)
        .reduce((sum, s) => sum + (s.equipments?.length || 0), 0);
        
      return {
        department: dept.name,
        equipment: facilityEquipCount + serviceEquipCount
      };
    }).filter(d => d.equipment > 0);
  }, [departments, facilities, services]);

  const assetStatus = useMemo(() => {
    const allFacilityEquipment = facilities?.flatMap(f => f.equipments || []) || [];
    const allServiceEquipment = services?.flatMap(s => s.equipments || []) || [];
    const allEquipment = [...allFacilityEquipment, ...allServiceEquipment];

    const available = allEquipment.filter(e => e.isAvailable ?? true).length;
    const unavailable = allEquipment.length - available;

    return [
      { name: 'Available', value: available, fill: 'var(--color-brand-end)' },
      { name: 'Unavailable', value: unavailable, fill: 'hsl(var(--destructive))' },
    ];
  }, [facilities, services]);

  const assetTypes = useMemo(() => {
    const facilityEquipCount = facilities?.reduce((sum, f) => sum + (f.equipments?.length || 0), 0) || 0;
    const serviceEquipCount = services?.reduce((sum, s) => sum + (s.equipments?.length || 0), 0) || 0;
    return [
        { name: 'Facility Equipment', value: facilityEquipCount, fill: 'var(--color-brand-start)' },
        { name: 'Service Equipment', value: serviceEquipCount, fill: 'var(--color-brand-end)' },
    ]
  }, [facilities, services]);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3">
          <DepartmentDistributionChart data={departmentDistribution} />
        </Card>
        <Card className="lg:col-span-2">
          <AssetStatusChart data={assetStatus} />
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <AssetTypeChart data={assetTypes} />
        </Card>
        <Card className="p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Report</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This dashboard provides a real-time overview of the institution's research assets. 
            Use the charts to understand resource distribution and availability. For detailed management, 
            navigate to the respective tabs for Departments, Facilities, and Services.
          </p>
        </Card>
      </div>
    </div>
  );
}
