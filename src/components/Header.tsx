
import { Stethoscope, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="md:hidden mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          <Stethoscope className="text-primary h-7 w-7 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              MedRescue
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Emergency Medication Guide
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full hover:bg-muted"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
