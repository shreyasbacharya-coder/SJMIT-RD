import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFacilities, useDeleteFacility, useDeleteFacilityEquipment } from '../hooks/useFacilities';
import { useDepartments } from '@/features/departments/hooks/useDepartments';
import { Loader2 } from 'lucide-react';
import { ConfirmationModal } from '@/shared/components/ConfirmationModal';
import { EquipmentFilterBar } from '@/features/infrastructure/components/EquipmentFilterBar';
import { FacilitiesTable } from '../components/FacilitiesTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

function FacilitiesTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Lab Name</TableHead>
            <TableHead className="hidden md:table-cell">Department</TableHead>
            <TableHead className="hidden lg:table-cell">Faculty In-Charge</TableHead>
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
              <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-40 rounded-md" /></TableCell>
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

export function AdminFacilitiesPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<{ facilityId: string; equipmentId: string } | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');
  
  const router = useRouter();
  const { data: facilities, isLoading: facilitiesLoading, isFetching: facilitiesFetching } = useFacilities();
  const { data: departmentsData, isLoading: departmentsLoading, isFetching: departmentsFetching } = useDepartments();
  const deleteFacility = useDeleteFacility();
  const deleteFacilityEquipment = useDeleteFacilityEquipment();


  useEffect(() => {
    const storedId = sessionStorage.getItem('expandedFacilityRow');
    if (storedId) {
        setExpandedRowId(storedId);
    }
  }, []);

  const handleToggleRow = (id: string) => {
    const newId = expandedRowId === id ? null : id;
    setExpandedRowId(newId);
    if (newId) {
        sessionStorage.setItem('expandedFacilityRow', newId);
    } else {
        sessionStorage.removeItem('expandedFacilityRow');
    }
  };

  const departments = useMemo(() => {
    if (!departmentsData) return ['All'];
    return ['All', ...departmentsData.map(d => d.name).sort()];
  }, [departmentsData]);

  const filteredAndSortedFacilities = useMemo(() => {
    if (!facilities) return [];
    
    let processed = facilities.filter(f => {
      const matchesSearch = 
        (f.labName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.facultyInCharge || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.equipments || []).some(eq => eq.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDept = selectedDepartment === 'All' || f.department === selectedDepartment;
      
      return matchesSearch && matchesDept;
    });

    processed.sort((a, b) => {
      switch(sortBy) {
        case 'name_desc': return b.labName.localeCompare(a.labName);
        case 'department': return (a.department || '').localeCompare(b.department || '');
        case 'name_asc':
        default: return a.labName.localeCompare(b.labName);
      }
    });

    return processed;
  }, [facilities, searchTerm, selectedDepartment, sortBy]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteFacility.mutateAsync(deletingId);
      setDeletingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!deletingEquipment) return;
    try {
      await deleteFacilityEquipment.mutateAsync(deletingEquipment);
      setDeletingEquipment(null);
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleEdit = (id: string) => {
    router.push(`/admin/facilities/edit?id=${id}`);
  };

  const isLoading = 
    (facilitiesLoading || (facilitiesFetching && !facilities)) ||
    (departmentsLoading || (departmentsFetching && !departmentsData));

  return (
    <div>
      <EquipmentFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        showTypeFilter={false}
        showViewChange={false}
        departments={departments}
        selectedDepartment={selectedDepartment}
        onSelectedDepartmentChange={setSelectedDepartment}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        searchPlaceholder="Search facilities by name, dept, faculty, equipment..."
      />

      {isLoading ? (
        <FacilitiesTableSkeleton />
      ) : (
        <div className="space-y-8">
          {filteredAndSortedFacilities?.length === 0 ? (
            <div className="col-span-full text-center py-24 glass-card border-2 border-dashed border-slate-300 dark:border-white/10">
              <p className="text-slate-700 dark:text-slate-300 font-medium text-lg mb-4">No facilities found matching your criteria.</p>
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
            <FacilitiesTable
              facilities={filteredAndSortedFacilities}
              onEdit={handleEdit}
              onDelete={setDeletingId}
              onDeleteEquipment={(facilityId, equipmentId) => setDeletingEquipment({ facilityId, equipmentId })}
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
        message="Are you sure you want to delete this facility? This action cannot be undone."
        confirmButtonText="Delete"
      />
      
      <ConfirmationModal
        isOpen={!!deletingEquipment}
        onClose={() => setDeletingEquipment(null)}
        onConfirm={handleDeleteEquipment}
        title="Confirm Delete Equipment"
        message="Are you sure you want to delete this equipment? This action cannot be undone."
        confirmButtonText="Delete"
      />
    </div>
  );
}
