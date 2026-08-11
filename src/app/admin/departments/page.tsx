'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminDepartmentDetailClientPage } from '@/features/departments/components/AdminDepartmentDetailClientPage';
import { Loader2 } from 'lucide-react';

function AdminDepartmentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    // No ?id= → redirect back to admin tab
    return null;
  }

  return <AdminDepartmentDetailClientPage id={id} />;
}

export default function AdminDepartmentDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-start" size={48} />
      </div>
    }>
      <AdminDepartmentContent />
    </Suspense>
  );
}
