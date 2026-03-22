import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { settings } = useStore();
  const profile = settings.profile;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-border-soft)] bg-[var(--color-bg-pure)]/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-[var(--color-text-dark)] lg:hidden">GoalFlow AI</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-error)] border-2 border-white"></span>
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-primary)] border-2 border-white shadow-sm">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-xs font-bold text-gray-800">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
