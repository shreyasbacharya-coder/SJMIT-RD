'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

import { AdminDepartmentsPage } from '@/features/departments/pages/AdminDepartmentsPage';
import { AdminFacilitiesPage } from '@/features/facilities/pages/AdminFacilitiesPage';
import { AdminServicesPage } from '@/features/services/pages/AdminServicesPage';
import { AdminDashboardPage } from '@/features/dashboard/pages/AdminDashboardPage';

type Tab = 'dashboard' | 'department' | 'facility' | 'service';

const pageDetails: { [key in Tab]: { title: React.ReactNode, description: string } } = {
  dashboard: {
    title: <>Admin <br /><span className="text-gradient">Dashboard</span></>,
    description: "An overview of the research infrastructure ecosystem."
  },
  department: {
    title: <>Manage <br /><span className="text-gradient">Departments</span></>,
    description: "Add, edit, and manage academic departments."
  },
  facility: {
    title: <>Manage <br /><span className="text-gradient">Facilities</span></>,
    description: "Add, edit, and manage research facilities and laboratories."
  },
  service: {
    title: <>Manage <br /><span className="text-gradient">Services</span></>,
    description: "Add, edit, and manage specialized services and consultancies."
  }
};


function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromQuery = searchParams.get('tab') as Tab | null;
  
  const [activeTab, setActiveTab] = useState<Tab>(tabFromQuery || 'dashboard');

  useEffect(() => {
    const currentTab = tabFromQuery || 'dashboard';
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [tabFromQuery, activeTab]);
  
  const addHref = {
    dashboard: '', // No href for dashboard
    department: '/admin/departments/new',
    facility: '/admin/facilities/new',
    service: '/admin/services/new',
  };

  const currentDetails = pageDetails[activeTab];

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader
          title={currentDetails.title}
          description={currentDetails.description}
        >
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-slate-100 font-bold text-sm rounded-xl border border-slate-200 dark:border-white/10 transition-all shadow-sm"
          >
            <HelpCircle size={16} className="text-brand-start" />
            <span>Help & Docs</span>
          </Link>
        </PageHeader>
        
        <div key={activeTab}>
          {activeTab === 'dashboard' && <AdminDashboardPage />}
          {activeTab === 'department' && <AdminDepartmentsPage />}
          {activeTab === 'facility' && <AdminFacilitiesPage />}
          {activeTab === 'service' && <AdminServicesPage />}
        </div>
      </PageContainer>
      
      {activeTab !== 'dashboard' && addHref[activeTab] && (
        <Link
          href={addHref[activeTab]}
          className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl w-16 h-16 shadow-2xl z-40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-700 dark:border-slate-200"
          aria-label={`Add new ${activeTab}`}
        >
          <Plus size={36} className="stroke-[3.5] text-white dark:text-slate-950" />
        </Link>
      )}
    </ProtectedRoute>
  );
}

export default function AdminPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading admin panel...</div>}>
      <AdminContent />
    </React.Suspense>
  );
}
