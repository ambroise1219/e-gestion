import { 
  DocumentIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function DocumentModalTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: DocumentIcon },
    { id: 'stats', label: 'Statistiques', icon: ChartBarIcon },
    { id: 'history', label: 'Historique', icon: ClockIcon },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-pro-lime text-pro-lime'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <Icon
                className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${
                    activeTab === tab.id
                      ? 'text-pro-lime'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }
                `}
                aria-hidden="true"
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
