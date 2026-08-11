'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
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
        />
        
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
          className="fixed bottom-8 right-8 btn-primary rounded-full w-14 h-14 p-0 shadow-2xl shadow-brand-start/40 z-40 flex items-center justify-center hover:scale-110 active:scale-100 transition-transform"
          aria-label={`Add new ${activeTab}`}
        >
          <Plus size={32} />
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
