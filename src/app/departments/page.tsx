'use client';
import React, { useState } from 'react';
import { useDepartments } from '@/features/departments/hooks/useDepartments';
import { DepartmentCard } from '@/features/departments/components/DepartmentCard';
import { Loader2, Search } from 'lucide-react';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card } from '@/components/ui/card';

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = departments?.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.hod || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title={
          <>
            Academic <span className="text-gradient">Departments</span>
          </>
        }
        description="Explore the specialized research infrastructure and services offered by each academic department at SJMIT."
      />

      <div className="relative max-w-xl mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input
          type="text"
          placeholder="Search by name or HOD..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full focus:ring-2 focus:ring-brand-start outline-none shadow-lg text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all font-normal"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[350px] bg-slate-100 dark:bg-white/5 animate-pulse rounded-[2.5rem] border border-slate-200 dark:border-white/10" />
          ))}
        </div>
      ) : (
        <>
          {filteredDepartments && filteredDepartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDepartments.map(dept => (
                <DepartmentCard key={dept.id} department={dept} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 border-dashed">
              <p className="text-slate-500 dark:text-slate-400 mb-4">No departments found matching your search.</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="btn-secondary"
              >
                Clear Search
              </button>
            </Card>
          )}
        </>
      )}
    </PageContainer>
  );
}
