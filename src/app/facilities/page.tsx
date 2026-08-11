'use client';
import React, { useState, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { useEquipmentList } from '@/features/infrastructure/hooks/useEquipmentList';
import { EquipmentGrid } from '@/features/infrastructure/components/EquipmentGrid';
import { EquipmentFilterBar } from '@/features/infrastructure/components/EquipmentFilterBar';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card } from '@/components/ui/card';

export default function FacilitiesPage() {
  const { data: equipmentList, isLoading } = useEquipmentList();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');

  const facilityEquipments = useMemo(() => {
    if (!equipmentList) return [];
    return equipmentList.filter(eq => eq.type === 'facility');
  }, [equipmentList]);

  const departments = useMemo(() => {
    if (!facilityEquipments) return ['All'];
    const depts = new Set<string>();
    facilityEquipments.forEach(eq => {
      if (eq.department && eq.department !== 'Unknown Department') depts.add(eq.department);
    });
    return ['All', ...Array.from(depts).sort()];
  }, [facilityEquipments]);

  const filteredAndSortedEquipments = useMemo(() => {
    if (!facilityEquipments) return [];
    const term = searchTerm.toLowerCase();

    let processed = facilityEquipments.filter(eq => {
      const matchesSearch = 
        (eq.name || '').toLowerCase().includes(term) ||
        (eq.department || '').toLowerCase().includes(term) ||
        (eq.description || '').toLowerCase().includes(term) ||
        (eq.tags || []).some(tag => tag.toLowerCase().includes(term)) ||
        (eq.labName || '').toLowerCase().includes(term) ||
        (eq.facultyInCharge || '').toLowerCase().includes(term);
      
      const matchesDept = selectedDepartment === 'All' || eq.department === selectedDepartment;
      
      return matchesSearch && matchesDept;
    });

    processed.sort((a, b) => {
      switch(sortBy) {
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'department': return (a.department || '').localeCompare(b.department || '');
        case 'name_asc':
        default: return a.name.localeCompare(b.name);
      }
    });

    return processed;
  }, [facilityEquipments, searchTerm, selectedDepartment, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All');
    setSortBy('name_asc');
  }

  const renderContent = () => {
    if (isLoading) {
      return <EquipmentGrid equipments={[]} isLoading={true} view={view} />;
    }

    if (filteredAndSortedEquipments.length === 0 && (searchTerm || selectedDepartment !== 'All')) {
      return <EquipmentGrid equipments={[]} isLoading={false} view={view} onClearFilters={clearFilters} />;
    }

    if (filteredAndSortedEquipments.length === 0) {
      return (
        <Card className="text-center py-32 border-2 border-dashed border-slate-300 dark:border-white/10">
          <div className="inline-flex p-8 bg-slate-100 dark:bg-white/5 rounded-full mb-8 border border-slate-200 dark:border-white/10">
            <Building2 size={64} className="text-slate-400 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">No Facility Equipment Found</h3>
          <p className="text-slate-500 dark:text-slate-400 font-light text-lg max-w-md mx-auto">
            There are currently no equipment listed under facilities. Please check back later or add new ones in the admin panel.
          </p>
        </Card>
      );
    }

    return (
      <EquipmentGrid
        equipments={filteredAndSortedEquipments}
        isLoading={false}
        view={view}
        onClearFilters={clearFilters}
      />
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title={<>Facility <span className="text-gradient">Equipment</span></>}
        description="Browse all specialized equipment available in our research facilities and laboratories."
      />
      
      <EquipmentFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        view={view}
        onViewChange={setView}
        departments={departments}
        selectedDepartment={selectedDepartment}
        onSelectedDepartmentChange={setSelectedDepartment}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        searchPlaceholder="Search facilities by name, dept, faculty, etc."
      />

      {renderContent()}
    </PageContainer>
  );
}
