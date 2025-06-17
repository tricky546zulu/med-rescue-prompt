
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, Siren, Eye, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import VoteButtons from './VoteButtons';
import { Medication } from '@/data/medications';

interface RedditCardProps {
  medication: Medication;
  onView: (id: string) => void;
  onVote: (id: string, direction: 'up' | 'down') => void;
  userVote?: 'up' | 'down' | null;
  viewCount?: number;
  className?: string;
  compact?: boolean;
}

const RedditCard: React.FC<RedditCardProps> = ({
  medication,
  onView,
  onVote,
  userVote,
  viewCount = 0,
  className,
  compact = false
}) => {
  const hasHighAlert = medication.alerts.some(a => a.level === 'High Alert' || a.level === 'Black Box');
  const hasCaution = medication.alerts.some(a => a.level === 'Caution');

  return (
    <Card className={cn(
      "reddit-card bg-card border border-border hover:border-primary/20 transition-all duration-200",
      "hover:shadow-md hover:-translate-y-0.5",
      compact && "compact-mode",
      className
    )}>
      <CardContent className={cn("p-0", compact ? "py-2" : "p-3")}>
        <div className="flex">
          {/* Vote Section - Reddit Style */}
          <div className="flex flex-col items-center justify-start pt-2 px-2 min-w-[48px]">
            <VoteButtons
              onVote={(direction) => onVote(medication.id, direction)}
              userVote={userVote}
              compact={compact}
            />
            <div className="text-xs text-muted-foreground mt-1 font-medium">
              {viewCount > 0 ? viewCount : '•'}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <Link 
              to={`/medication/${medication.id}`}
              className="block group"
              onClick={() => onView(medication.id)}
            >
              <div className={cn("p-3", compact && "py-2")}>
                {/* Header with badges and alerts */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-wrap items-center gap-1 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      r/{medication.category.replace(/\s+/g, '').toLowerCase()}
                    </Badge>
                    {medication.subcategory && (
                      <Badge variant="outline" className="text-xs">
                        {medication.subcategory}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    {hasHighAlert && (
                      <Siren className="h-4 w-4 text-red-500 animate-pulse" />
                    )}
                    {hasCaution && !hasHighAlert && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className={cn(
                  "font-bold text-foreground group-hover:text-primary transition-colors",
                  "line-clamp-2 leading-tight mb-2",
                  compact ? "text-base medication-title" : "text-lg"
                )}>
                  {medication.name}
                  {medication.genericName && (
                    <span className="text-sm text-muted-foreground font-normal ml-2">
                      ({medication.genericName})
                    </span>
                  )}
                </h3>

                {/* Description */}
                <p className={cn(
                  "text-muted-foreground leading-relaxed mb-3",
                  compact ? "text-sm line-clamp-2 medication-description" : "text-sm line-clamp-3"
                )}>
                  {medication.description}
                </p>

                {/* Quick Info Row */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {/* Primary Indications */}
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{medication.indications.length} indication{medication.indications.length !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Routes */}
                  <div className="flex items-center">
                    <span>{medication.administration.routes.slice(0, 2).join(', ')}</span>
                    {medication.administration.routes.length > 2 && (
                      <span className="ml-1">+{medication.administration.routes.length - 2}</span>
                    )}
                  </div>

                  {/* Onset if available */}
                  {medication.onsetDuration && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Onset: {medication.onsetDuration.onset}</span>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:text-primary">
                      <Eye className="h-3 w-3 mr-1" />
                      Quick View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:text-primary">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Emergency Medicine
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RedditCard;
