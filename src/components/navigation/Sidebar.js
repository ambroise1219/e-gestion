'use client';

import { useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CubeIcon,
  BanknotesIcon,
  CalendarIcon,
  TruckIcon,
  ShieldCheckIcon,
  DocumentIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';

const navigation = [
  { name: 'Tableau de Bord', href: '/', icon: HomeIcon },
  { name: 'Employés', href: '/employes', icon: UsersIcon },
  { name: 'Projets', href: '/projets', icon: FolderIcon },
  { name: 'Stock', href: '/stock', icon: CubeIcon },
  { name: 'Finances', href: '/finances', icon: BanknotesIcon },
  { name: 'Planning', href: '/planning', icon: CalendarIcon },
  { name: 'Fournisseurs', href: '/fournisseurs', icon: TruckIcon },
  { name: 'Sécurité', href: '/securite', icon: ShieldCheckIcon },
  { name: 'Documents', href: '/documents', icon: DocumentIcon },
  { name: 'Paramètres', href: '/parametres', icon: Cog6ToothIcon },
];

export default function Sidebar({ onNavigate, currentPath }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useTheme();

  const handleNavigation = (path) => {
    onNavigate(path);
  };

  return (
    <div 
      className={`
        transition-all duration-300 
        bg-white dark:bg-pro-black-light 
        border-r border-gray-200 dark:border-pro-lime/20
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-pro-lime/20">
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-pro-lime">
               X GESTION
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg text-gray-500 dark:text-pro-white-off 
                     hover:bg-gray-100 dark:hover:bg-pro-black-dark 
                     transition-colors"
            aria-label={isCollapsed ? 'Développer' : 'Réduire'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`
                  w-full flex items-center p-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-pro-lime/20 font-semibold dark:bg-pro-lime/10 text-black dark:text-white border border-pro-lime/30 dark:border-pro-lime/20' 
                    : 'text-black dark:text-pro-white-off hover:bg-gray-50 dark:hover:bg-pro-black hover:text-pro-lime dark:hover:text-pro-lime-light'
                  }
                `}
              >
                <item.icon 
                  className={`h-6 w-6 shrink-0 ${
                    isActive 
                      ? 'text-black dark:text-pro-lime-light' 
                      : 'text-black dark:text-pro-white-off group-hover:text-pro-lime dark:group-hover:text-pro-lime-light'
                  }`} 
                />
                {!isCollapsed && (
                  <span className="ml-3 transition-colors">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
