'use client';

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function MovementCard({ transaction }) {
  const getTypeColor = (type) => {
    if (!type) return 'text-gray-500 bg-gray-100';
    
    switch (type) {
      case 'in':
      case 'initial':
      case 'adjustment_up':
        return 'text-green-500 bg-green-100';
      case 'out':
      case 'adjustment_down':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getTypeLabel = (type) => {
    if (!type) return 'Non spécifié';
    
    switch (type) {
      case 'in':
        return 'Entrée';
      case 'out':
        return 'Sortie';
      case 'initial':
        return 'Stock initial';
      case 'adjustment_up':
        return 'Ajustement +';
      case 'adjustment_down':
        return 'Ajustement -';
      default:
        return type;
    }
  };

  if (!transaction) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(transaction.type)}`}>
            {transaction.type?.includes('out') ? (
              <ArrowTrendingDownIcon className="w-5 h-5" />
            ) : (
              <ArrowTrendingUpIcon className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {getTypeLabel(transaction.type)}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transaction.reference || 'Sans référence'}
            </p>
          </div>
        </div>
        <span className={`text-lg font-semibold ${transaction.type?.includes('out') ? 'text-red-500' : 'text-green-500'}`}>
          {transaction.type?.includes('out') ? '-' : '+'}{Math.abs(transaction.quantity || 0)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <UserCircleIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {transaction.user_name || 'Système'}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {transaction.date ? new Date(transaction.date).toLocaleString('fr-FR') : 'Date non spécifiée'}
          </span>
        </div>

        {transaction.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
            {transaction.notes}
          </p>
        )}
      </div>
    </div>
  );
}
