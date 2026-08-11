import React from 'react';
import { Beaker } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ServiceEquipment } from '../../../shared/types';

interface EquipmentServiceCardProps {
  equipment: ServiceEquipment;
  department: string;
  suitableDates: string;
  key?: string;
}

export function EquipmentServiceCard({ equipment, department, suitableDates }: EquipmentServiceCardProps) {
  return (
    <Card className="p-5 hover:shadow-lg transition-shadow border border-slate-100 bg-white rounded-xl shadow-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Beaker size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-lg mb-1 truncate">{equipment.name}</h4>
          
          <div className="space-y-3 mt-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
              <p className="text-sm font-medium text-slate-700">{department}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Utilization Rate</p>
                <p className="text-sm font-medium text-slate-700">{equipment.utilizationRate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available</p>
                <p className="text-sm font-medium text-slate-700">{suitableDates}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
