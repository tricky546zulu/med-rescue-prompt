
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  onVote: (direction: 'up' | 'down') => void;
  userVote?: 'up' | 'down' | null;
  compact?: boolean;
  className?: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  onVote,
  userVote,
  compact = false,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "vote-button p-0 hover:bg-transparent",
          compact ? "h-5 w-5" : "h-6 w-6",
          userVote === 'up' && "upvoted"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onVote('up');
        }}
      >
        <ChevronUp className={cn(
          "transition-all duration-200",
          compact ? "h-4 w-4" : "h-5 w-5",
          userVote === 'up' ? "text-upvote animate-vote-bounce" : "text-vote-arrow hover:text-upvote"
        )} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "vote-button p-0 hover:bg-transparent",
          compact ? "h-5 w-5" : "h-6 w-6",
          userVote === 'down' && "downvoted"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onVote('down');
        }}
      >
        <ChevronDown className={cn(
          "transition-all duration-200",
          compact ? "h-4 w-4" : "h-5 w-5",
          userVote === 'down' ? "text-downvote animate-vote-bounce" : "text-vote-arrow hover:text-downvote"
        )} />
      </Button>
    </div>
  );
};

export default VoteButtons;
