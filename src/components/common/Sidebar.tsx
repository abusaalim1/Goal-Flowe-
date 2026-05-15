import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, BarChart2, Settings, BookOpen, X } from 'lucide-react';
import { cn } from './Button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'E-Book', path: '/ebook', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--color-border-soft)] bg-[var(--color-bg-pure)] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-[var(--color-border-soft)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">GoalFlow AI</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-primary)]/30 text-[var(--color-text-dark)]'
                    : 'text-[var(--color-text-light)] hover:bg-gray-50 hover:text-[var(--color-text-dark)]'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
