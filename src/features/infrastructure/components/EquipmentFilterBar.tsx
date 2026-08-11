import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { FilterDrawer } from './FilterDrawer';

type ViewType = 'grid' | 'list';
type EquipmentType = 'All' | 'facility' | 'service';

interface EquipmentFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  
  showTypeFilter?: boolean;
  selectedType?: EquipmentType;
  onSelectedTypeChange?: (value: EquipmentType) => void;
  
  view?: ViewType;
  onViewChange?: (value: ViewType) => void;
  
  departments: string[];
  selectedDepartment: string;
  onSelectedDepartmentChange: (value: string) => void;
  
  sortBy: string;
  onSortByChange: (value: string) => void;

  showSortBy?: boolean;
  showViewChange?: boolean;
  showDepartmentFilter?: boolean;
  sortOptions?: { value: string; label: string }[];
  searchPlaceholder?: string;
}

const defaultSortOptions = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'department', label: 'Department' },
];

export function EquipmentFilterBar({
  searchTerm,
  onSearchTermChange,
  searchInputRef,
  showTypeFilter = false,
  selectedType,
  onSelectedTypeChange,
  view,
  onViewChange,
  departments,
  selectedDepartment,
  onSelectedDepartmentChange,
  sortBy,
  onSortByChange,
  showSortBy = true,
  showViewChange = true,
  showDepartmentFilter = true,
  sortOptions = defaultSortOptions,
  searchPlaceholder = "Search by name, department, description..."
}: EquipmentFilterBarProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const hasFilters = showTypeFilter || showDepartmentFilter;
  
  const renderFilters = () => (
    <div className="flex flex-col gap-y-4">
      {showTypeFilter && onSelectedTypeChange && (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Filter size={16} className="text-emerald-700 dark:text-brand-end" />
              <span className="text-xs font-bold uppercase tracking-wider">Type</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                  onClick={() => onSelectedTypeChange('All')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${ selectedType === 'All' ? 'bg-slate-900 dark:bg-brand-start text-white border-slate-900 dark:border-brand-start shadow-md' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:border-brand-start/50 hover:text-brand-start'}`}
              >
                  All
              </button>
              <button
                  onClick={() => onSelectedTypeChange('facility')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${ selectedType === 'facility' ? 'bg-slate-900 dark:bg-brand-start text-white border-slate-900 dark:border-brand-start shadow-md' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:border-brand-start/50 hover:text-brand-start'}`}
              >
                  Facilities
              </button>
              <button
                  onClick={() => onSelectedTypeChange('service')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${ selectedType === 'service' ? 'bg-slate-900 dark:bg-brand-start text-white border-slate-900 dark:border-brand-start shadow-md' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:border-brand-start/50 hover:text-brand-start'}`}
              >
                  Services
              </button>
            </div>
        </div>
      )}
      
      {showDepartmentFilter && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Filter size={16} className="text-blue-700 dark:text-brand-start" />
              <span className="text-xs font-bold uppercase tracking-wider">Department</span>
          </div>
          <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
              <button
                  key={dept}
                  onClick={() => onSelectedDepartmentChange(dept)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  selectedDepartment === dept
                      ? 'bg-slate-900 dark:bg-brand-start text-white border-slate-900 dark:border-brand-start shadow-md shadow-brand-start/20'
                      : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:border-brand-start/50 hover:text-brand-start'
                  }`}
              >
                  {dept}
              </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 mb-12">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-grow w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-700 dark:group-focus-within:text-brand-start transition-colors" size={20} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full text-base text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-start/10 focus:border-brand-start transition-all shadow-xl"
          />
        </div>
        <div className="flex-shrink-0 w-full md:w-auto flex items-center justify-end gap-2">
            {showSortBy && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-3 rounded-full bg-white dark:bg-white/5 shadow-xl border border-slate-300 dark:border-white/10 text-blue-700 dark:text-brand-start hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                    <ArrowUpDown size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={onSortByChange}>
                    {sortOptions.map(option => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showViewChange && view && onViewChange && (
              <div className="flex bg-white dark:bg-white/5 p-1 rounded-full border border-slate-300 dark:border-white/10 backdrop-blur-xl shadow-xl">
                  <button onClick={() => onViewChange('grid')} className={cn('p-2 rounded-full transition-all', view === 'grid' ? 'bg-slate-900 dark:bg-gradient-brand text-white shadow-xl' : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white')}>
                      <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => onViewChange('list')} className={cn('p-2 rounded-full transition-all', view === 'list' ? 'bg-slate-900 dark:bg-gradient-brand text-white shadow-xl' : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white')}>
                      <List size={18} />
                  </button>
              </div>
            )}
            
            {hasFilters && (
              <button onClick={() => setIsFilterDrawerOpen(true)} className="p-3 rounded-full bg-white dark:bg-white/5 shadow-xl border border-slate-300 dark:border-white/10 text-blue-700 dark:text-brand-start hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                <SlidersHorizontal size={20} />
              </button>
            )}
        </div>
      </div>
      
      <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)}>
        {renderFilters()}
      </FilterDrawer>
    </div>
  );
}
