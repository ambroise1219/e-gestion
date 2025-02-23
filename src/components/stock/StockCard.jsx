'use client';

import {
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function StockCard({ item, onSelect, onEdit, onDelete }) {
  const getStockLevelColor = (quantity, min_quantity, max_quantity) => {
    if (quantity <= 0) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    if (quantity <= min_quantity) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    if (quantity >= max_quantity) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
  };

  const getStockLevelText = (quantity, min_quantity, max_quantity) => {
    if (quantity <= 0) return 'Rupture';
    if (quantity <= min_quantity) return 'Stock critique';
    if (quantity >= max_quantity) return 'Surstock';
    return 'Stock normal';
  };

  const getProgressColor = (quantity, min_quantity, max_quantity) => {
    if (quantity <= 0) return 'bg-red-600';
    if (quantity <= min_quantity) return 'bg-yellow-600';
    if (quantity >= max_quantity) return 'bg-blue-600';
    return 'bg-green-600';
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      onDelete(item.id);
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-pro-lime dark:hover:border-pro-lime"
    >
      <div className="p-6">
        {/* Header avec nom et statut */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-pro-lime/10">
              <CubeIcon className="w-6 h-6 text-pro-lime" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.reference}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              getStockLevelColor(item.quantity, item.min_quantity, item.max_quantity)
            }`}>
              {getStockLevelText(item.quantity, item.min_quantity, item.max_quantity)}
            </span>
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <PencilSquareIcon className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <TrashIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Niveau de stock */}
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600 dark:text-gray-400">Niveau de stock</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round((item.quantity / item.max_quantity) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  getProgressColor(item.quantity, item.min_quantity, item.max_quantity)
                }`}
                style={{ 
                  width: `${Math.min(Math.round((item.quantity / item.max_quantity) * 100), 100)}%`
                }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Min: {item.min_quantity}</span>
              <span>Max: {item.max_quantity}</span>
            </div>
          </div>

          {/* Métriques clés */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Quantité</span>
              <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {item.quantity} {item.unit}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Valeur</span>
              <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(item.quantity * item.unit_price)}
              </span>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BanknotesIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(item.unit_price)} / {item.unit}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.location || 'Non assigné'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.supplier_name || 'Aucun fournisseur'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dernière activité */}
      {item.recent_transactions?.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl">
          <div className="flex items-center space-x-2">
            {item.recent_transactions[0].type === 'in' ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dernier mouvement: {new Date(item.recent_transactions[0].date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
