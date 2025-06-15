
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Siren } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/', label: 'Med Search', icon: Stethoscope },
  { href: '/protocols', label: 'Protocols', icon: Siren },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pb-20">{children}</main>
      <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
        <div className="grid h-full max-w-lg grid-cols-2 mx-auto font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
