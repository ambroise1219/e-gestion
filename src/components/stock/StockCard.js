'use client';

import {
  PencilIcon,
  TrashIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

export default function StockCard({ item, onSelect, onEdit, onDelete }) {
  const getStatusColor = (quantity, minimum_quantity) => {
    if (quantity <= 0) return 'bg-red-500';
    if (quantity <= minimum_quantity) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div 
      onClick={() => onSelect(item)}
      className="bg-white dark:bg-pro-black-light rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-pro-black-dark group"
    >
      <div className="p-6">
        {/* En-tête avec statut et actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <span 
              className={`h-3 w-3 rounded-full ${getStatusColor(item.quantity, item.minimum_quantity)}`}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.quantity <= 0 
                ? 'Rupture'
                : item.quantity <= item.minimum_quantity
                ? 'Stock bas'
                : 'En stock'}
            </span>
          </div>
          
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-pro-black rounded-lg transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
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
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Détails du stock */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Quantité
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {item.quantity} {item.unit}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Stock minimum
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {item.minimum_quantity} {item.unit}
            </p>
          </div>
        </div>

        {/* Tags et prix */}
        <div className="mt-4 flex items-center justify-between">
          <span className="px-2 py-1 text-xs rounded-full bg-[#CCFF00]/10 dark:bg-pro-lime/10 text-black dark:text-pro-lime">
            {item.category}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatPrice(item.purchase_price)}
          </span>
        </div>
      </div>

      {/* Dernière activité */}
      {item.recent_transactions && item.recent_transactions[0] && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-pro-black-dark">
          <div className="flex items-center space-x-2">
            {item.recent_transactions[0].type === 'in' ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500" />
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dernier mouvement: {new Date(item.recent_transactions[0].date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}