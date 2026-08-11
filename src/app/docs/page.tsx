'use client';
import React from 'react';
import { PageContainer } from '@/shared/components/PageContainer';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card } from '@/components/ui/card';
import { BookOpen, Compass, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <PageContainer>
      <PageHeader
        title={<>User Guide & <span className="text-gradient">App Flow</span></>}
        description="A complete guide to exploring public R&D resources and managing R&D infrastructure."
      />

      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6 glass-card hover:border-brand-start/50 transition-all">
            <Compass className="text-brand-start mb-4" size={32} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Public Visitor Flow</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Browse departments, facilities, and live equipment specifications.</p>
            <a href="#public-flow" className="text-xs font-bold text-brand-start flex items-center gap-1 hover:underline">
              View Flow <ArrowRight size={14} />
            </a>
          </Card>

          <Card className="p-6 glass-card hover:border-brand-start/50 transition-all">
            <ShieldCheck className="text-brand-end mb-4" size={32} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Admin Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Manage departments, labs, services, and equipment records.</p>
            <a href="#admin-flow" className="text-xs font-bold text-brand-end flex items-center gap-1 hover:underline">
              View Flow <ArrowRight size={14} />
            </a>
          </Card>

          <Card className="p-6 glass-card hover:border-brand-start/50 transition-all">
            <Cpu className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">CSR Architecture</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">How live updates work instantly without rebuilding the static site.</p>
            <a href="#architecture" className="text-xs font-bold text-emerald-500 flex items-center gap-1 hover:underline">
              View Details <ArrowRight size={14} />
            </a>
          </Card>
        </div>

        {/* Public User Flow */}
        <section id="public-flow" className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Compass className="text-brand-start" /> Public User Flow
          </h2>

          <div className="space-y-4">
            <Card className="p-6 border-l-4 border-l-brand-start">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">1. Academic Departments</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Go to <strong>Departments</strong> in the top navigation bar (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/departments/</code>).
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>Search departments by name or Head of Department (HOD).</li>
                <li>Click any department card to view its dedicated page (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/departments/?id=civil-eng</code>).</li>
                <li>View associated lab facilities and equipment live from the database.</li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-brand-start">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">2. Research Infrastructure & Equipment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Go to <strong>Infrastructure</strong> (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/infrastructure/</code>).
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>Filter equipment by academic department, search terms, or view layout (Grid / List).</li>
                <li>Click any equipment item to open full live details (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/equipment/?id=&lt;id&gt;</code>).</li>
                <li>Check availability status, lab location, and technical specifications.</li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-brand-start">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">3. Facilities & Services Directories</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Explore specialized lab facilities (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/facilities/</code>) and testing services (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/services/</code>).
              </p>
            </Card>
          </div>
        </section>

        {/* Admin Flow */}
        <section id="admin-flow" className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-brand-end" /> Admin Flow (R&D Managers)
          </h2>

          <div className="space-y-4">
            <Card className="p-6 border-l-4 border-l-brand-end">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">1. Dashboard & Login</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Access <strong>Admin Login</strong> (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/login/</code> or <code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/admin/</code>) to view overall statistics and system status.
              </p>
            </Card>

            <Card className="p-6 border-l-4 border-l-brand-end">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">2. Managing Data</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li><strong>Add Department</strong>: Click "+ Add Department" in the Departments tab (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/admin/departments/new/</code>).</li>
                <li><strong>Edit Records</strong>: Edit departments, facilities, or services using query parameter links (<code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">/admin/departments/edit/?id=&lt;id&gt;</code>).</li>
                <li><strong>Add Equipment to Facility</strong>: Click "+ Add Equipment" inside any lab row.</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Cpu className="text-emerald-500" /> Static Host Architecture
          </h2>

          <Card className="p-6 bg-slate-50 dark:bg-white/5 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The portal is built as a static site hosted on <strong>GitHub Pages</strong> with 100% Client-Side Rendering (CSR):
            </p>
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
              GitHub Pages (Static Host) ──► Load HTML Shell ──► Browser Reads Query Param (?id=...) ──► Fetch Live Firebase DB Data ──► Render Page
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ✅ <strong>No Rebuild Needed</strong>: Creating or updating departments, facilities, or equipment in the admin panel updates the live site instantly without re-deploying GitHub Pages.
            </p>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}
