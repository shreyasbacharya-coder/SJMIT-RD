import React, { useState, useMemo } from 'react';
import { useDepartments, useDeleteDepartment } from '../hooks/useDepartments';
import { ConfirmationModal } from '@/shared/components/ConfirmationModal';
import { EquipmentFilterBar } from '@/features/infrastructure/components/EquipmentFilterBar';
import { DepartmentsTable } from '../components/DepartmentsTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

const deptSortOptions = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
];

function DepartmentsTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16"></TableHead>
            <TableHead>Department Name</TableHead>
            <TableHead className="hidden sm:table-cell">HOD</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell><Skeleton className="h-10 w-10 rounded-lg" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48 rounded-md" /></TableCell>
              <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-32 rounded-md" /></TableCell>
              <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-40 rounded-md" /></TableCell>
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

export function AdminDepartmentsPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  
  const { data: departments, isLoading, isFetching } = useDepartments();
  const deleteDepartment = useDeleteDepartment();

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDepartment.mutateAsync(deletingId);
      setDeletingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAndSortedDepartments = useMemo(() => {
    if (!departments) return [];
    
    let processed = departments.filter(d => 
      (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.hod || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    processed.sort((a, b) => {
      switch(sortBy) {
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'name_asc':
        default: return a.name.localeCompare(b.name);
      }
    });

    return processed;
  }, [departments, searchTerm, sortBy]);

  const showSkeleton = isLoading || (isFetching && !departments);

  return (
    <div>
       <EquipmentFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        showTypeFilter={false}
        showViewChange={false}
        showDepartmentFilter={false}
        departments={[]}
        selectedDepartment=""
        onSelectedDepartmentChange={() => {}}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={deptSortOptions}
        searchPlaceholder="Search departments by name or HOD..."
      />

      {showSkeleton ? (
        <DepartmentsTableSkeleton />
      ) : (
        <>
          {filteredAndSortedDepartments?.length === 0 ? (
            <div className="col-span-full text-center py-24 glass-card border-2 border-dashed border-slate-300 dark:border-white/10">
              <p className="text-slate-700 dark:text-slate-300 font-medium text-lg mb-4">No departments found matching "{searchTerm}".</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-6 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-300 dark:border-white/10"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <DepartmentsTable departments={filteredAndSortedDepartments} onDelete={setDeletingId} />
          )}
        </>
      )}
      
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this department? This action cannot be undone and may affect associated facilities and services."
        confirmButtonText="Delete"
      />
    </div>
  );
}
