'use client';
import React, { useState, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { useEquipmentList } from '@/features/infrastructure/hooks/useEquipmentList';
import { EquipmentGrid } from '@/features/infrastructure/components/EquipmentGrid';
import { EquipmentFilterBar } from '@/features/infrastructure/components/EquipmentFilterBar';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card } from '@/components/ui/card';

export default function ServicesPage() {
  const { data: equipmentList, isLoading } = useEquipmentList();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');

  const serviceEquipments = useMemo(() => {
    if (!equipmentList) return [];
    return equipmentList.filter(eq => eq.type === 'service');
  }, [equipmentList]);

  const departments = useMemo(() => {
    if (!serviceEquipments) return ['All'];
    const depts = new Set<string>();
    serviceEquipments.forEach(eq => {
      if (eq.department && eq.department !== 'Unknown Department') depts.add(eq.department);
    });
    return ['All', ...Array.from(depts).sort()];
  }, [serviceEquipments]);

  const filteredAndSortedEquipments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let processed = serviceEquipments.filter(eq => {
      const matchesSearch = 
        (eq.name || '').toLowerCase().includes(term) ||
        (eq.department || '').toLowerCase().includes(term) ||
        (eq.description || '').toLowerCase().includes(term) ||
        (eq.tags || []).some(tag => tag.toLowerCase().includes(term));
      
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
  }, [serviceEquipments, searchTerm, selectedDepartment, sortBy]);

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
            <Activity size={64} className="text-slate-400 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">No Service Equipment Found</h3>
          <p className="text-slate-500 dark:text-slate-400 font-light text-lg max-w-md mx-auto">
            There is currently no equipment listed under services. Please check back later or add new ones in the admin panel.
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
        title={<>Service <span className="text-gradient">Equipment</span></>}
        description="Discover all equipment associated with the technical consultancy and testing services offered by our departments."
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
        searchPlaceholder="Search services by name, dept, tags, etc."
      />

      {renderContent()}
    </PageContainer>
  );
}
