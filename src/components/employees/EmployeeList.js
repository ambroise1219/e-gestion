'use client';

import { EnvelopeIcon, PencilIcon, PhoneIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EmployeeList({ 
  employees, 
  viewMode, 
  onEmployeeClick, 
  onEditClick, 
  onDeleteClick 
}) {
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white dark:bg-pro-black-card rounded-lg p-6 border border-gray-200 dark:border-pro-black-dark hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onEmployeeClick(employee)}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#CCFF00]/20 dark:bg-pro-lime/20 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                  {employee.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 truncate">{employee.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{employee.department}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleActionClick(e, () => onEditClick(employee))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-pro-black-dark rounded-lg"
                >
                  <PencilIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{employee.phone}</span>
              </div>
            </div>

            {employee.projects && employee.projects.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Projets actuels
                </div>
                <div className="flex flex-wrap gap-2">
                  {employee.projects.map((project, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pro-lime dark:bg-pro-lime text-gray-900 dark:text-black hover:bg-pro-lime/90 dark:hover:bg-pro-lime/90"
                    >
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-pro-black-card rounded-lg border border-gray-200 dark:border-pro-black-dark overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-pro-black-dark">
          <thead className="bg-gray-50 dark:bg-pro-black">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Employé
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Département
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Projets
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date d'embauche
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-pro-black-dark">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 dark:hover:bg-pro-black transition-colors cursor-pointer"
                onClick={() => onEmployeeClick(employee)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#CCFF00]/20 dark:bg-pro-lime/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 dark:text-white">{employee.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{employee.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{employee.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{employee.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{employee.department}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {employee.projects.map((project, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#CCFF00]/10 dark:bg-pro-lime/10 text-gray-900 dark:text-white"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(employee.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => handleActionClick(e, () => onEditClick(employee))}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-pro-black rounded-lg"
                    >
                      <PencilIcon className="w-4 h-4 text-pro-lime dark:text-pro-lime" />
                    </button>
                    <button
                      onClick={(e) => handleActionClick(e, () => onDeleteClick(employee.id))}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-pro-black rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}