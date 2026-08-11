'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2, User, Target, Activity, Calendar, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { UnifiedEquipment } from '../hooks/useEquipmentList';
import Link from 'next/link';
import { PageContainer } from '@/shared/components/PageContainer';
import { Breadcrumbs, BreadcrumbItem } from '@/shared/components/Breadcrumbs';

interface EquipmentDetailPageProps {
  equipment: UnifiedEquipment;
  breadcrumbs: BreadcrumbItem[];
}

export function EquipmentDetailPage({ equipment, breadcrumbs }: EquipmentDetailPageProps) {
  const [imgError, setImgError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fallbackImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

  const images = equipment.images?.length > 0 ? equipment.images : [equipment.imageUrl];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setImgError(false);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setImgError(false);
  };

  return (
    <PageContainer>
        <Breadcrumbs items={breadcrumbs} />
        <div 
            className="bg-white dark:bg-[#0a0c10] w-full max-w-4xl mx-auto overflow-hidden relative rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col"
        >
            {/* Top: Image Carousel Section */}
            <div className="w-full h-[400px] sm:h-[500px] shrink-0 relative overflow-hidden group bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x > swipeThreshold) {
                      prevImage({ stopPropagation: () => {} } as any);
                    } else if (info.offset.x < -swipeThreshold) {
                      nextImage({ stopPropagation: () => {} } as any);
                    }
                  }}
                  className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center bg-black"
                >
                  {/* Blurred background for premium look */}
                  <img 
                    src={imgError ? fallbackImage : images[currentImageIndex]} 
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-125"
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src={imgError ? fallbackImage : images[currentImageIndex]} 
                    alt={`${equipment.name} - Image ${currentImageIndex + 1}`} 
                    onError={() => setImgError(true)}
                    className="relative z-10 max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-20" />
              
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all border border-white/10 z-20"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all border border-white/10 z-20"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        aria-label={`Go to image ${idx + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                          setImgError(false);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute bottom-10 left-8 right-8 pointer-events-none z-30">
                <span className={`px-4 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-[0.3em] mb-4 inline-block shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl border ${
                  equipment.type === 'facility' 
                    ? 'bg-blue-600/95 text-white border-blue-400/50' 
                    : 'bg-emerald-600/95 text-white border-emerald-400/50'
                }`}>
                  {equipment.type === 'facility' ? 'Facility Asset' : 'Service Asset'}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,1)]">
                  {equipment.name}
                </h2>
              </div>
            </div>

            {/* Bottom: Content Section */}
            <div className="p-8 md:p-12 bg-white dark:bg-[#0a0c10]">
              <div className="max-w-3xl mx-auto space-y-12">
                
                {/* 1. Equipment Info Section */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Equipment Information</h3>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Overview</h4>
                      <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                        "{equipment.description || 'No detailed description provided for this asset.'}"
                      </p>
                    </div>

                    {equipment.tags && equipment.tags.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Capabilities & Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {equipment.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-full border border-slate-200 dark:border-white/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {equipment.researchFocus && (
                      <div className="p-4 bg-brand-start/5 rounded-2xl border border-brand-start/10">
                        <h4 className="text-[10px] font-bold text-brand-start uppercase tracking-widest mb-2">Research Focus</h4>
                        <p className="text-slate-700 dark:text-slate-300 font-bold">{equipment.researchFocus}</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* 2. Facility / Service Info Section */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                      {equipment.type === 'facility' ? 'Facility Details' : 'Service Details'}
                    </h3>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Department</h4>
                        <div className="flex items-center gap-3">
                          <Building2 size={16} className="text-brand-start" />
                          <span className="font-bold text-slate-900 dark:text-white">{equipment.department}</span>
                        </div>
                      </div>

                      {equipment.type === 'facility' && equipment.labName && (
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Laboratory</h4>
                          <div className="flex items-center gap-3">
                            <Building2 size={16} className="text-brand-start" />
                            <span className="font-bold text-slate-900 dark:text-white">{equipment.labName}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {equipment.facultyInCharge && (
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Faculty In-Charge</h4>
                          <div className="flex items-center gap-3">
                            <User size={16} className="text-brand-start" />
                            <span className="font-bold text-slate-900 dark:text-white">{equipment.facultyInCharge}</span>
                          </div>
                        </div>
                      )}
                      
                      {equipment.suitableDates && (
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Availability</h4>
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-brand-end" />
                            <span className="font-bold text-slate-900 dark:text-white">
                              {equipment.suitableDates}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info for Facility only */}
                  {equipment.type === 'facility' && (equipment.email || equipment.contact) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                      {equipment.email && (
                        <a href={`mailto:${equipment.email}`} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-brand-start transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-brand-start/10 flex items-center justify-center text-brand-start group-hover:bg-brand-start group-hover:text-white transition-colors">
                            <Mail size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Email</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{equipment.email}</span>
                          </div>
                        </a>
                      )}
                      {equipment.contact && (
                        <a href={`tel:${equipment.contact}`} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-brand-start transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-brand-start/10 flex items-center justify-center text-brand-start group-hover:bg-brand-start group-hover:text-white transition-colors">
                            <Phone size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Contact</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{equipment.contact}</span>
                          </div>
                        </a>
                      )}
                    </div>
                  )}
                </section>
              </div>
            </div>
        </div>
    </PageContainer>
  );
}
