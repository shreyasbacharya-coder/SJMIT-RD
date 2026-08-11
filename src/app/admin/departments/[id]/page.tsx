import { departmentsApi } from '@/features/departments/api';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Users, Phone, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';

export async function generateStaticParams() {
  try {
      const departments = await departmentsApi.getAll();
      return departments.map((department) => ({
          id: department.id,
      }));
  } catch (error) {
      console.error("Failed to generate static params for admin departments", error);
      return [];
  }
}

export default async function AdminDepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let viewingDepartment;
    try {
        viewingDepartment = await departmentsApi.getById(id);
    } catch (error) {
        console.error(`Failed to fetch department ${id}`, error);
        notFound();
    }
    
    if (!viewingDepartment) {
        notFound();
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Admin', href: '/admin?tab=department' },
      { label: 'Departments', href: '/admin?tab=department' },
      { label: viewingDepartment.name },
    ];

    return (
        <PageContainer>
            <Breadcrumbs items={breadcrumbs} />
            <PageHeader
                title={viewingDepartment.name}
                description="Detailed information for the department."
            />
             <div className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-3xl">
                {viewingDepartment.image && <img src={viewingDepartment.image} alt={viewingDepartment.name} className="w-full h-64 object-cover rounded-2xl mb-4" referrerPolicy="no-referrer" />}
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{viewingDepartment.name}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">HOD / Coordinator</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                      <Users size={14} className="text-brand-start" />
                      {viewingDepartment.hod || 'N/A'}
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                      <Mail size={14} className="text-brand-start" />
                      {viewingDepartment.email || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-white/10">
                    <Link href={`/departments/${viewingDepartment.id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary py-2 px-6 text-sm group">
                        View Public Page <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
              </div>
        </PageContainer>
    )
}
