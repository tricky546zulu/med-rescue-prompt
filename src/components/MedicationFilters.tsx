
import * as React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

  const renderFilterGroup = (title: string, items: string[], filterType: FilterType, selectedItems: string[]) => (
    <div>
      <h4 className="font-semibold mb-2 text-gray-700">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox
              id={`${filterType}-${item}`}
              checked={selectedItems.includes(item)}
              onCheckedChange={() => onFilterChange(filterType, item)}
            />
            <Label htmlFor={`${filterType}-${item}`} className="font-normal text-sm text-gray-600 cursor-pointer">
              {item}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      {renderFilterGroup('Category', allCategories, 'categories', filters.categories)}
      {renderFilterGroup('Alert Level', allAlertLevels, 'alertLevels', filters.alertLevels)}
      {renderFilterGroup('Administration Route', allAdminRoutes, 'adminRoutes', filters.adminRoutes)}
    </div>
  );
};

export default MedicationFilters;
