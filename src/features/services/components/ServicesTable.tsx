'use client';
import React, { Fragment } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, ChevronDown, Plus } from 'lucide-react';
import { Service } from '@/shared/types';
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
import { cn } from '@/shared/utils/cn';

interface ServicesTableProps {
  services: Service[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteEquipment: (serviceId: string, equipmentId: string) => void;
  expandedRowId: string | null;
  onToggleRow: (id: string) => void;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

export function ServicesTable({ services, onEdit, onDelete, onDeleteEquipment, expandedRowId, onToggleRow }: ServicesTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="hidden md:table-cell">Suitable Dates</TableHead>
              <TableHead>Equipment Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <Fragment key={service.id}>
                <TableRow className="group hover:bg-slate-50 dark:hover:bg-white/5">
                  <TableCell>
                    {service.equipments && service.equipments.length > 0 && (
                      <button onClick={() => onToggleRow(service.id)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10">
                        <ChevronDown size={16} className={cn("transition-transform", expandedRowId === service.id && "rotate-180")} />
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {service.department}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{service.suitableDates || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="success">
                      {service.equipments?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(service.id)}
                        className="flex items-center justify-center p-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(service.id)}
                        className="flex items-center justify-center p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRowId === service.id && (
                  <TableRow className="bg-slate-50 dark:bg-black/20 hover:bg-slate-50 dark:hover:bg-black/20">
                    <TableCell colSpan={5}>
                      <div className="p-6 space-y-6">
                        {/* Equipment Sub-Table */}
                        {service.equipments && service.equipments.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                                Equipment
                              </h4>
                              <Link
                                href={`/admin/equipment/new?type=service&parentId=${service.id}`}
                                className="flex items-center gap-1 text-xs font-bold text-brand-end hover:text-brand-start transition-colors"
                              >
                                <Plus size={14} />
                                Add Equipment
                              </Link>
                            </div>
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                              <div className="overflow-x-auto">
                                <Table className="bg-transparent">
                                  <TableHeader>
                                    <TableRow className="border-slate-100 dark:border-white/5">
                                      <TableHead className="w-16">Image</TableHead>
                                      <TableHead>Name</TableHead>
                                      <TableHead className="hidden lg:table-cell">Utilization Rate</TableHead>
                                      <TableHead className="hidden xl:table-cell">Description</TableHead>
                                      <TableHead className="hidden md:table-cell">Tags</TableHead>
                                      <TableHead>Availability</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {service.equipments.map((equipment, index) => (
                                      <TableRow key={index} className="border-t border-slate-100 dark:border-white/5">
                                        <TableCell>
                                          <img 
                                            src={(equipment.images && equipment.images[0]) || PLACEHOLDER_IMAGE}
                                            alt={equipment.name}
                                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                            referrerPolicy="no-referrer"
                                          />
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-900 dark:text-white">{equipment.name}</TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm font-medium">{equipment.utilizationRate || 'N/A'}</TableCell>
                                        <TableCell className="hidden xl:table-cell text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">{equipment.description || 'N/A'}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                          <div className="flex flex-wrap gap-1">
                                            {(equipment.tags || []).map(tag => (
                                              <Badge key={tag} variant="default">{tag}</Badge>
                                            ))}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", equipment.isAvailable ?? true ? 'bg-emerald-500' : 'bg-rose-500')} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                              {equipment.isAvailable ?? true ? "Available" : "Unavailable"}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                           <div className="flex items-center justify-end gap-2">
                                              <Link
                                                href={`/admin/equipment/edit?type=service&parentId=${service.id}&equipmentId=${equipment.id}`}
                                                className="flex items-center justify-center p-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
                                              >
                                                <Pencil size={14} />
                                              </Link>
                                              <button
                                                onClick={() => onDeleteEquipment(service.id, equipment.id)}
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
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
