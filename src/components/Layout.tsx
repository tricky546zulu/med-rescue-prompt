
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // For the index page, we don't want the default layout since it has its own sidebar
  if (location.pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pb-20">{children}</main>
      <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
        <div className="grid h-full max-w-lg grid-cols-1 mx-auto font-medium">
          <Link
            to="/"
            className={cn(
              'inline-flex flex-col items-center justify-center px-5 hover:bg-muted group',
              location.pathname === '/'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Stethoscope className="w-6 h-6 mb-1" />
            <span className="text-sm">Drug Reference</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
