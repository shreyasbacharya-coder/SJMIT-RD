'use client';
import React from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Users } from 'lucide-react';
import { Department } from '@/shared/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/components/ui/card';

interface DepartmentsTableProps {
  departments: Department[];
  onDelete: (id: string) => void;
}

export function DepartmentsTable({ departments, onDelete }: DepartmentsTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Department Name</TableHead>
              <TableHead className="hidden sm:table-cell">HOD</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id} className="group hover:bg-slate-50 dark:hover:bg-white/5">
                <TableCell>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    {dept.image ? (
                      <img 
                        src={dept.image} 
                        alt={dept.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Users size={20} className="text-slate-400 dark:text-slate-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-900 dark:text-white">
                  <Link href={`/admin/departments/${dept.id}`} className="hover:text-brand-start transition-colors">
                    {dept.name}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{dept.hod || 'N/A'}</TableCell>
                <TableCell className="hidden lg:table-cell">{dept.email || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/departments/${dept.id}/edit`}
                      className="flex items-center justify-center p-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => onDelete(dept.id)}
                      className="flex items-center justify-center p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
