
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Heart, Clock, TrendingUp, Filter, Settings, Info } from 'lucide-react';
import { getMedicationCategories } from '@/data/medications';

interface RedditSidebarProps {
  onCategorySelect: (category: string) => void;
  onFilterSelect: (filter: string) => void;
  selectedCategory?: string;
  categoryStats?: { name: string; count: number; highAlert: number }[];
}

const RedditSidebar: React.FC<RedditSidebarProps> = ({
  onCategorySelect,
  onFilterSelect,
  selectedCategory,
  categoryStats = []
}) => {
  const sortOptions = [
    { name: 'Hot', icon: TrendingUp, description: 'Most viewed today' },
    { name: 'New', icon: Clock, description: 'Recently added' },
    { name: 'Emergency', icon: Heart, description: 'High priority meds' }
  ];

  const categories = getMedicationCategories();

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-bold text-sidebar-foreground">MedRescue</h2>
            <p className="text-xs text-sidebar-foreground/70">Emergency Medicine Reference</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Sort Options */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Sort By</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sortOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <SidebarMenuItem key={option.name}>
                    <SidebarMenuButton 
                      onClick={() => onFilterSelect(option.name.toLowerCase())}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <IconComponent className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{option.name}</span>
                        <p className="text-xs text-sidebar-foreground/50 truncate">
                          {option.description}
                        </p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories - Reddit Style Communities */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Communities (Categories)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const stats = categoryStats.find(s => s.name === category);
                const isSelected = selectedCategory === category;
                
                return (
                  <SidebarMenuItem key={category}>
                    <SidebarMenuButton 
                      onClick={() => onCategorySelect(category)}
                      className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        isSelected ? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            r/{category.replace(/\s+/g, '').toLowerCase()}
                          </span>
                          {stats && (
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                {stats.count}
                              </Badge>
                              {stats.highAlert > 0 && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  {stats.highAlert}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-sidebar-foreground/50 truncate">
                          {category} medications
                        </p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Advanced Filters</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Heart className="h-4 w-4" />
                  <span>My Favorites</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" size="sm" className="justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button variant="ghost" size="sm" className="justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <Info className="h-4 w-4 mr-2" />
          About
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default RedditSidebar;
