'use client';

import {
  CubeIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  DocumentIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const tabs = [
  {
    name: 'Aperçu',
    icon: CubeIcon,
  },
  {
    name: 'Mouvements',
    icon: ArrowsRightLeftIcon,
  },
  {
    name: 'Statistiques',
    icon: ChartBarIcon,
  },
  {
    name: 'Documents',
    icon: DocumentIcon,
  },
  {
    name: 'Emplacements',
    icon: MapPinIcon,
  },
];

export default function StockModalTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              className={`
                flex items-center space-x-2 px-3 py-2 text-sm font-medium border-b-2 
                ${
                  activeTab === tab.name
                    ? 'border-pro-lime text-pro-lime'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
