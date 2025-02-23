'use client';

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserCircleIcon,
  DocumentTextIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function MovementCard({ transaction }) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'in':
      case 'initial':
      case 'adjustment_up':
        return 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'out':
      case 'adjustment_down':
        return 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'in':
      case 'initial':
      case 'adjustment_up':
        return <ArrowTrendingUpIcon className="w-5 h-5" />;
      case 'out':
      case 'adjustment_down':
        return <ArrowTrendingDownIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type) => {
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(transaction.type)}`}>
            {getTypeIcon(transaction.type)}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {getTypeLabel(transaction.type)}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transaction.reference}
            </p>
          </div>
        </div>
        <span className={`text-lg font-semibold ${transaction.type.includes('out') ? 'text-red-500' : 'text-green-500'}`}>
          {transaction.type.includes('out') ? '-' : '+'}{Math.abs(transaction.quantity)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {/* Informations sur l'emplacement */}
        {(transaction.source_location_id || transaction.destination_location_id) && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPinIcon className="w-4 h-4" />
            <span>
              {transaction.source_location_id && transaction.destination_location_id ? (
                `${transaction.source_location_id} → ${transaction.destination_location_id}`
              ) : transaction.source_location_id ? (
                `Depuis: ${transaction.source_location_id}`
              ) : (
                `Vers: ${transaction.destination_location_id}`
              )}
            </span>
          </div>
        )}

        {/* Utilisateur et date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <UserCircleIcon className="w-4 h-4" />
            <span>{transaction.user_name || 'Système'}</span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            {formatDate(transaction.date)}
          </span>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
            {transaction.notes}
          </p>
        )}
      </div>
    </div>
  );
}