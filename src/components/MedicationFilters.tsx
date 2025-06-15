
import * as React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

type FilterType = 'categories' | 'alertLevels' | 'adminRoutes';

interface MedicationFiltersProps {
  allCategories: string[];
  allAlertLevels: string[];
  allAdminRoutes: string[];
  filters: {
    categories: string[];
    alertLevels: string[];
    adminRoutes: string[];
  };
  onFilterChange: (filterType: FilterType, value: string) => void;
}

const MedicationFilters: React.FC<MedicationFiltersProps> = ({
  allCategories,
  allAlertLevels,
  allAdminRoutes,
  filters,
  onFilterChange,
}) => {

  const clearAllFilters = () => {
    filters.categories.forEach(cat => onFilterChange('categories', cat));
    filters.alertLevels.forEach(level => onFilterChange('alertLevels', level));
    filters.adminRoutes.forEach(route => onFilterChange('adminRoutes', route));
  };

  const hasActiveFilters = filters.categories.length + filters.alertLevels.length + filters.adminRoutes.length > 0;

  const renderFilterGroup = (title: string, items: string[], filterType: FilterType, selectedItems: string[]) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{title}</h4>
        {selectedItems.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedItems.length} selected
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Checkbox
              id={`${filterType}-${item}`}
              checked={selectedItems.includes(item)}
              onCheckedChange={() => onFilterChange(filterType, item)}
              className="flex-shrink-0"
            />
            <Label 
              htmlFor={`${filterType}-${item}`} 
              className="font-normal text-sm text-gray-700 cursor-pointer leading-tight flex-1"
            >
              {item}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Filter Medications</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-xs">
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-600">Active Filters:</h5>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(cat => (
              <Badge key={cat} variant="default" className="text-xs">
                {cat}
                <button 
                  onClick={() => onFilterChange('categories', cat)}
                  className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.alertLevels.map(level => (
              <Badge key={level} variant="destructive" className="text-xs">
                {level}
                <button 
                  onClick={() => onFilterChange('alertLevels', level)}
                  className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.adminRoutes.map(route => (
              <Badge key={route} variant="secondary" className="text-xs">
                {route}
                <button 
                  onClick={() => onFilterChange('adminRoutes', route)}
                  className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      <div className="space-y-8">
        {renderFilterGroup('Medication Category', allCategories, 'categories', filters.categories)}
        {renderFilterGroup('Alert Level', allAlertLevels, 'alertLevels', filters.alertLevels)}
        {renderFilterGroup('Administration Route', allAdminRoutes, 'adminRoutes', filters.adminRoutes)}
      </div>

      {/* Filter Statistics */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h5 className="text-sm font-medium text-gray-600 mb-2">Filter Summary:</h5>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-blue-600">{allCategories.length}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-600">{allAlertLevels.length}</p>
            <p className="text-xs text-gray-500">Alert Levels</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{allAdminRoutes.length}</p>
            <p className="text-xs text-gray-500">Routes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationFilters;
