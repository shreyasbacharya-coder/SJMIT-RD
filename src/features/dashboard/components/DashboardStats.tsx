"use client"
import { Card } from '@/components/ui/card';
import { Users, Building2, Activity, Beaker } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalDepartments: number;
    facilityEquipmentCount: number;
    serviceEquipmentCount: number;
    totalAssets: number;
  };
}

const statItems = [
    { key: 'totalDepartments', title: 'Total Departments', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { key: 'facilityEquipmentCount', title: 'Facility Assets', icon: Building2, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { key: 'serviceEquipmentCount', title: 'Service Offerings', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { key: 'totalAssets', title: 'Total Assets', icon: Beaker, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
] as const;

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map(item => (
        <Card key={item.key} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${item.bgColor} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.title}</p>
              <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                {stats[item.key]}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
