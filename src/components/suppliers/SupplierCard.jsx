'use client';

import { BuildingOfficeIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function SupplierCard({ supplier, onClick }) {
  return (
    <div
      onClick={() => onClick(supplier)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-pro-lime dark:hover:border-pro-lime-dark"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-start space-x-4">
          <div className="p-2 sm:p-3 rounded-lg bg-pro-lime dark:bg-pro-lime-dark flex-shrink-0">
            <BuildingOfficeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-pro-black dark:text-pro-black" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {supplier.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {supplier.category}
            </p>
          </div>
        </div>
        <span className={`inline-flex px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
          supplier.status === 'Active' 
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100'
            : 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
        }`}>
          {supplier.status}
        </span>
      </div>

      <div className="mt-4 sm:mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <PhoneIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{supplier.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{supplier.email}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Commandes en cours
              </p>
              <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {supplier.activeOrders}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total commandes
              </p>
              <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {supplier.totalOrders}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
