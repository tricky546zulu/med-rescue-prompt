
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Heart, Filter, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortingTabsProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  resultCount?: number;
  viewMode: 'grid' | 'compact';
  onViewModeChange: (mode: 'grid' | 'compact') => void;
  className?: string;
}

const SortingTabs: React.FC<SortingTabsProps> = ({
  currentSort,
  onSortChange,
  resultCount,
  viewMode,
  onViewModeChange,
  className
}) => {
  const sortOptions = [
    { key: 'hot', label: 'Hot', icon: TrendingUp, description: 'Trending medications' },
    { key: 'new', label: 'New', icon: Clock, description: 'Recently added' },
    { key: 'emergency', label: 'Emergency', icon: Heart, description: 'High priority' },
  ];

  return (
    <div className={cn("flex items-center justify-between bg-card border border-border rounded-lg p-2", className)}>
      {/* Sort Tabs */}
      <div className="flex items-center gap-1">
        {sortOptions.map((option) => {
          const IconComponent = option.icon;
          const isActive = currentSort === option.key;
          
          return (
            <Button
              key={option.key}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onSortChange(option.key)}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                isActive && "bg-primary text-primary-foreground shadow-sm"
              )}
            >
              <IconComponent className="h-4 w-4" />
              <span className="font-medium">{option.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2">
        {/* Result Count */}
        {resultCount !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {resultCount} result{resultCount !== 1 ? 's' : ''}
          </Badge>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center border border-border rounded-md">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="h-7 px-2 rounded-r-none border-r"
          >
            <LayoutGrid className="h-3 w-3" />
          </Button>
          <Button
            variant={viewMode === 'compact' ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange('compact')}
            className="h-7 px-2 rounded-l-none"
          >
            <List className="h-3 w-3" />
          </Button>
        </div>

        {/* Filter Button */}
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
      </div>
    </div>
  );
};

export default SortingTabs;
