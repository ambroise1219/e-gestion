'use client';

import { 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function EmployeeCard({ employee, onEmployeeClick, onEditClick, onDeleteClick }) {
  const handleClick = () => {
    onEmployeeClick(employee);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white dark:bg-pro-black-light rounded-xl shadow-sm hover:shadow-md dark:hover:bg-pro-black/50 transition-all cursor-pointer border border-gray-200 dark:border-pro-black-dark group"
    >
      <div className="p-6">
        {/* Avatar et Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#CCFF00] dark:bg-pro-lime flex items-center justify-center text-black text-xl font-semibold">
              {employee.avatar ? (
                <img 
                  src={employee.avatar} 
                  alt={employee.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                employee.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <span 
              className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-pro-black-light rounded-full ${
                employee.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
              }`} 
            />
          </div>
          
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(employee);
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-pro-black rounded-lg transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(employee.id);
              }}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informations principales */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {employee.position}
          </p>
        </div>

        {/* Tags et informations supplémentaires */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs rounded-full bg-[#CCFF00]/10 dark:bg-pro-lime/10 text-black dark:text-pro-lime">
              {employee.department}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {employee.role}
            </span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="w-4 h-4" />
              <span>{employee.projects?.length || 0} projets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de carte avec date d'embauche */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-pro-black-dark">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Membre depuis {new Date(employee.startDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
