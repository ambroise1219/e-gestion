'use client';

import {
  CubeIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function MaterialCard({ material, minimal = false }) {
  const getStockStatus = () => {
    if (material.quantity <= 0) return { color: 'red', text: 'Rupture' };
    if (material.quantity <= material.min_quantity) return { color: 'red', text: 'Critique' };
    if (material.quantity <= material.min_quantity * 1.2) return { color: 'yellow', text: 'Bas' };
    if (material.quantity >= material.max_quantity) return { color: 'blue', text: 'Excédent' };
    return { color: 'green', text: 'Normal' };
  };

  const status = getStockStatus();

  if (minimal) {
    return (
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <CubeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{material.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{material.reference}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          status.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
          status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
          status.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
        }`}>
          {material.quantity} {material.unit}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              <CubeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{material.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{material.reference}</p>
            </div>
          </div>
          {status.color === 'red' || status.color === 'yellow' ? (
            <ExclamationTriangleIcon className={`w-6 h-6 ${
              status.color === 'red' ? 'text-red-500' : 'text-yellow-500'
            }`} />
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {material.location || 'Non assigné'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <BanknotesIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(material.unit_price)} / {material.unit}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Stock</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {material.quantity} / {material.max_quantity} {material.unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                status.color === 'red' ? 'bg-red-600' :
                status.color === 'yellow' ? 'bg-yellow-600' :
                status.color === 'blue' ? 'bg-blue-600' :
                'bg-green-600'
              }`}
              style={{
                width: `${Math.min(Math.round((material.quantity / material.max_quantity) * 100), 100)}%`
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Min: {material.min_quantity}</span>
            <span>Max: {material.max_quantity}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Valeur totale
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(material.quantity * material.unit_price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}