'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../app/providers/AuthProvider';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?from=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-start" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="max-w-2xl mx-auto mt-32 p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/10 blur-[100px] -z-10" />
        <div className="inline-flex p-6 bg-rose-500/10 rounded-3xl mb-8 border border-rose-500/20">
          <ShieldAlert className="h-16 w-16 text-rose-500" />
        </div>
        <h2 className="text-4xl font-display font-bold text-white mb-4 tracking-tight">Access Denied</h2>
        <p className="text-slate-400 mb-10 text-lg font-light leading-relaxed">
          Your account <span className="text-white font-medium">{user.email}</span> does not have administrator privileges for the SJMIT R&D Portal.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="btn-secondary"
        >
          Return Home
        </button>
      </Card>
    );
  }

  return <>{children}</>;
}
