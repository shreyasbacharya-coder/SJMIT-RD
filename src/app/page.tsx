'use client';
import React from 'react';
import { ArrowRight, GraduationCap, Building2, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Card } from '@/components/ui/card';
import { useFacilities } from '@/features/facilities/hooks/useFacilities';
import { useServices } from '@/features/services/hooks/useServices';
import { useDepartments } from '@/features/departments/hooks/useDepartments';

const StatCard = ({ stat }: { stat: any }) => {
  return (
    <Link href={stat.href} className="block group">
      <Card
        className="p-6 transition-all duration-300 hover:border-brand-start/50 hover:-translate-y-1"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.title}</p>
            <p className="text-5xl font-display font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
          </div>
          <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color}`}>
              <stat.icon size={28} />
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default function HomePage() {
  const { data: facilities } = useFacilities();
  const { data: services } = useServices();
  const { data: departments } = useDepartments();

  const facilityEquipmentCount = facilities?.reduce((acc, facility) => acc + (facility.equipments?.length || 0), 0) || 0;
  const serviceEquipmentCount = services?.reduce((acc, service) => acc + (service.equipments?.length || 0), 0) || 0;
  const departmentsCount = departments?.length || 0;

  const stats = [
    {
      title: 'Total Departments',
      value: departmentsCount,
      icon: GraduationCap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      href: '/departments'
    },
    {
      title: 'Facility Assets',
      value: facilityEquipmentCount,
      icon: Building2,
      color: 'text-brand-start',
      bgColor: 'bg-brand-start/10',
      href: '/facilities'
    },
    {
      title: 'Service Offerings',
      value: serviceEquipmentCount,
      icon: Activity,
      color: 'text-brand-end',
      bgColor: 'bg-brand-end/10',
      href: '/services'
    }
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-[#0a0c10] overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-start/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-end/20 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-10">
              <div className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full backdrop-blur-md">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-blue-700 dark:text-brand-start">SJMIT Institute of Technology</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-10 leading-[1.05] text-slate-950 dark:text-white">
              Research & <br />
              <span className="text-gradient">Development Center</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-14 leading-relaxed max-w-3xl mx-auto font-medium">
              A centralized hub for accessing state-of-the-art research facilities, specialized equipment, 
              and technical services to foster innovation and collaboration across all engineering departments.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/infrastructure"
                className="btn-primary flex items-center group text-base px-8 py-4"
              >
                Explore R&D Infrastructure
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Research Ecosystem at a Glance"
            description="Synergizing R&D facilities at intra & inter-institutional levels to maximize resource utilization and foster collaborative innovation."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
