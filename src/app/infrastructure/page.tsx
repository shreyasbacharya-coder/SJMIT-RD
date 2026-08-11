'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEquipmentList } from '@/features/infrastructure/hooks/useEquipmentList';
import { EquipmentGrid } from '@/features/infrastructure/components/EquipmentGrid';
import { EquipmentFilterBar } from '@/features/infrastructure/components/EquipmentFilterBar';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';

function InfrastructureContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const shouldFocusSearch = searchParams.get('focusSearch') === 'true';
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { data: equipmentList, isLoading } = useEquipmentList();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'facility' | 'service'>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name_asc');

  useEffect(() => {
    if (shouldFocusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [shouldFocusSearch]);

  const departments = useMemo(() => {
    if (!equipmentList) return ['All'];
    const depts = new Set<string>();
    equipmentList.forEach(eq => {
      if (eq.department && eq.department !== 'Unknown Department') {
        depts.add(eq.department);
      }
    });
    return ['All', ...Array.from(depts).sort()];
  }, [equipmentList]);

  const filteredEquipment = useMemo(() => {
    if (!equipmentList) return [];
    const term = searchTerm.toLowerCase();

    let processed = equipmentList.filter(eq => {
      const commonSearch =
        (eq.name || '').toLowerCase().includes(term) ||
        (eq.department || '').toLowerCase().includes(term) ||
        (eq.description || '').toLowerCase().includes(term) ||
        (eq.tags || []).some(tag => tag.toLowerCase().includes(term));
      
      const facilitySearch = eq.type === 'facility'
        ? (eq.labName || '').toLowerCase().includes(term) ||
          (eq.facultyInCharge || '').toLowerCase().includes(term)
        : false;

      const matchesSearch = commonSearch || facilitySearch;
      
      const matchesDept = selectedDepartment === 'All' || eq.department === selectedDepartment;
      const matchesType = selectedType === 'All' || eq.type === selectedType;

      return matchesSearch && matchesDept && matchesType;
    });

    processed.sort((a,b) => {
        switch(sortBy) {
            case 'name_desc':
                return b.name.localeCompare(a.name);
            case 'department':
                return (a.department || '').localeCompare(b.department || '');
            case 'name_asc':
            default:
                return a.name.localeCompare(b.name);
        }
    })
    return processed;

  }, [equipmentList, searchTerm, selectedDepartment, selectedType, sortBy]);

  return (
    <PageContainer>
      <PageHeader
        title={
          <>
            Research <span className="text-gradient">Infrastructure</span>
          </>
        }
        description="A comprehensive directory of specialized facilities and advanced equipment services powering innovation across SJMIT's academic and research departments."
      >
        <div className="flex gap-12">
            <div className="text-center">
              <p className="text-4xl font-display font-bold text-slate-950 dark:text-white mb-1">{equipmentList?.length || 0}</p>
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Total Assets</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-display font-bold text-slate-950 dark:text-white mb-1">{departments.length - 1}</p>
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Departments</p>
            </div>
          </div>
      </PageHeader>
      
      <EquipmentFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchInputRef={searchInputRef}
        showTypeFilter={true}
        selectedType={selectedType}
        onSelectedTypeChange={setSelectedType}
        view={view}
        onViewChange={setView}
        departments={departments}
        selectedDepartment={selectedDepartment}
        onSelectedDepartmentChange={setSelectedDepartment}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        searchPlaceholder="Search all assets by name, dept, tags, etc."
      />

      <EquipmentGrid 
        equipments={filteredEquipment} 
        isLoading={isLoading} 
        view={view}
        onClearFilters={() => {
          setSearchTerm('');
          setSelectedDepartment('All');
          setSelectedType('All');
          setSortBy('name_asc');
        }}
      />
    </PageContainer>
  );
}

export default function InfrastructurePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading infrastructure...</div>}>
      <InfrastructureContent />
    </React.Suspense>
  );
}
