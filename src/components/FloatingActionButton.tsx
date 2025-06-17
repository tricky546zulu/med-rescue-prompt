
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick?: () => void;
  variant?: 'search' | 'add';
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  variant = 'search',
  className
}) => {
  const Icon = variant === 'search' ? Search : Plus;

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full shadow-lg",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "transition-all duration-300 hover:scale-110 active:scale-95",
        "md:hidden", // Only show on mobile
        className
      )}
      size="sm"
    >
      <Icon className="h-6 w-6" />
    </Button>
  );
};

export default FloatingActionButton;
