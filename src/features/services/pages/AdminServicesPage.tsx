import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useServices, useDeleteService, useDeleteServiceEquipment } from '../hooks/useServices';
import { useDepartments } from '@/features/departments/hooks/useDepartments';
import { ConfirmationModal } from '@/shared/components/ConfirmationModal';
import { EquipmentFilterBar } from '@/features/infrastructure/components/EquipmentFilterBar';
import { ServicesTable } from '../components/ServicesTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

function ServicesTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="hidden md:table-cell">Suitable Dates</TableHead>
            <TableHead>Equipment Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48 rounded-md" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32 rounded-md" /></TableCell>
              <TableCell><Skeleton className="h-6 w-8 rounded-full" /></TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export function AdminServicesPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<{ serviceId: string, equipmentId: string } | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('department');
  
  const router = useRouter();
  const { data: services, isLoading: servicesLoading, isFetching: servicesFetching } = useServices();
  const { data: departmentsData, isLoading: departmentsLoading, isFetching: departmentsFetching } = useDepartments();
  const deleteService = useDeleteService();
  const deleteServiceEquipment = useDeleteServiceEquipment();

  useEffect(() => {
    const storedId = sessionStorage.getItem('expandedServiceRow');
    if (storedId) {
        setExpandedRowId(storedId);
    }
  }, []);

  const handleToggleRow = (id: string) => {
    const newId = expandedRowId === id ? null : id;
    setExpandedRowId(newId);
    if (newId) {
        sessionStorage.setItem('expandedServiceRow', newId);
    } else {
        sessionStorage.removeItem('expandedServiceRow');
    }
  };

  const departments = useMemo(() => {
    if (!departmentsData) return ['All'];
    return ['All', ...departmentsData.map(d => d.name).sort()];
  }, [departmentsData]);

  const filteredAndSortedServices = useMemo(() => {
    if (!services) return [];
    
    let processed = services.filter(s => {
      const matchesSearch = 
        (s.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.equipments || []).some(e => (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment;
      
      return matchesSearch && matchesDept;
    });

    processed.sort((a, b) => {
      return (a.department || '').localeCompare(b.department || '');
    });

    return processed;
  }, [services, searchTerm, selectedDepartment]);


  const handleEdit = (id: string) => {
    router.push(`/admin/services/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteService.mutateAsync(deletingId);
      setDeletingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!deletingEquipment) return;
    try {
      await deleteServiceEquipment.mutateAsync(deletingEquipment);
      setDeletingEquipment(null);
    } catch(e) {
      console.error(e);
    }
  };

  const isLoading =
    (servicesLoading || (servicesFetching && !services)) ||
    (departmentsLoading || (departmentsFetching && !departmentsData));

  return (
    <div>
       <EquipmentFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        showTypeFilter={false}
        showViewChange={false}
        showSortBy={false}
        departments={departments}
        selectedDepartment={selectedDepartment}
        onSelectedDepartmentChange={setSelectedDepartment}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        searchPlaceholder="Search services by department or equipment..."
      />

      {isLoading ? (
        <ServicesTableSkeleton />
      ) : (
        <div className="space-y-8">
          {filteredAndSortedServices?.length === 0 ? (
            <div className="col-span-full text-center py-24 glass-card border-2 border-dashed border-slate-300 dark:border-white/10">
              <p className="text-slate-700 dark:text-slate-300 font-medium text-lg mb-4">No services found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('All');
                }}
                className="px-6 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-300 dark:border-white/10"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <ServicesTable
              services={filteredAndSortedServices}
              onEdit={handleEdit}
              onDelete={setDeletingId}
              onDeleteEquipment={(serviceId, equipmentId) => setDeletingEquipment({ serviceId, equipmentId })}
              expandedRowId={expandedRowId}
              onToggleRow={handleToggleRow}
            />
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmButtonText="Delete"
      />
      
      <ConfirmationModal
        isOpen={!!deletingEquipment}
        onClose={() => setDeletingEquipment(null)}
        onConfirm={handleDeleteEquipment}
        title="Confirm Delete Equipment"
        message="Are you sure you want to delete this equipment from the service? This action cannot be undone."
        confirmButtonText="Delete"
      />
    </div>
  );
}
