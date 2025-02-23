import { useState } from 'react';
import MovementCard from './MovementCard';
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function StockModalMovements({ transactions, onMovement }) {
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    sortBy: 'date-desc'
  });

  const [showFilters, setShowFilters] = useState(false);

  const filterTransactions = (transactions) => {
    if (!transactions) return [];
    
    let filtered = [...transactions];

    // Filtrer par type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filtrer par date
    const now = new Date();
    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(t => {
          const date = new Date(t.date);
          return date.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
        break;
    }

    // Trier
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      switch (filters.sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'quantity-asc':
          return a.quantity - b.quantity;
        case 'quantity-desc':
          return b.quantity - a.quantity;
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  };

  const filteredTransactions = filterTransactions(transactions);

  const downloadTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Référence', 'Quantité', 'Source', 'Destination', 'Notes'].join(','),
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.reference,
        t.quantity,
        t.source_location_id || '',
        t.destination_location_id || '',
        t.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `mouvements_stock_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filtres</span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          {filteredTransactions.length > 0 && (
            <button
              onClick={downloadTransactions}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          )}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredTransactions.length} mouvements
        </span>
      </div>

      {/* Panneau des filtres */}
      {showFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                <option value="all">Tous les types</option>
                <option value="in">Entrées</option>
                <option value="out">Sorties</option>
                <option value="adjustment_up">Ajustements +</option>
                <option value="adjustment_down">Ajustements -</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Période
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tri
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                <option value="date-desc">Date (récent → ancien)</option>
                <option value="date-asc">Date (ancien → récent)</option>
                <option value="quantity-desc">Quantité (↓)</option>
                <option value="quantity-asc">Quantité (↑)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Liste des mouvements */}
      {filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <MovementCard key={transaction.id || index} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <AdjustmentsHorizontalIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Aucun mouvement</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filters.type !== 'all' || filters.dateRange !== 'all' 
              ? "Aucun mouvement ne correspond aux filtres sélectionnés."
              : "Il n'y a pas encore de mouvements pour cet article."}
          </p>
        </div>
      )}
    </div>
  );
}
