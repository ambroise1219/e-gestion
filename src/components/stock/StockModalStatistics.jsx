'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function StockModalStatistics({ item }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item?.id) {
      fetchStats();
    }
  }, [item?.id]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stock/statistics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id })
      });

      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pro-lime"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Erreur</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const { current_analysis: analysis, predictions } = stats;

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-red-500 bg-red-100 dark:bg-red-900/50';
      case 'warning':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50';
      case 'overstock':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/50';
      default:
        return 'text-green-500 bg-green-100 dark:bg-green-900/50';
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(num * 100) / 100);
  };

  return (
    <div className="space-y-6">
      {/* État actuel */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          État actuel du stock
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stock actuel</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatNumber(analysis.current_stock)} {item.unit}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${getStockStatusColor(analysis.stock_status)}`}>
                <ChartBarIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Consommation moyenne</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatNumber(analysis.avg_daily_consumption)} {item.unit}/jour
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-500">
                <ArrowTrendingDownIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Réception moyenne</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatNumber(analysis.avg_daily_receipts)} {item.unit}/jour
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-500">
                <ArrowTrendingUpIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rotation mensuelle</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatNumber(analysis.monthly_turnover_rate)}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-500">
                <ClockIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prévisions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Prévisions et recommandations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Consommation estimée
            </h4>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">7 prochains jours</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(predictions.next_week_consumption)} {item.unit}
                </dd>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <dt className="text-sm text-gray-500 dark:text-gray-400">30 prochains jours</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(predictions.next_month_consumption)} {item.unit}
                </dd>
              </div>
              {analysis.days_until_stockout && (
                <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Rupture estimée dans</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatNumber(analysis.days_until_stockout)} jours
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Recommandations
            </h4>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Point de commande recommandé</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(predictions.recommended_reorder_point)} {item.unit}
                </dd>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Quantité à commander</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(Math.max(0, predictions.recommended_order_quantity))} {item.unit}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Historique d'activité */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Activité
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Jours d'activité</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {analysis.active_days}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Écart-type consommation</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(analysis.stddev_consumption)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Seuil d'alerte actuel</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(item.min_quantity)} {item.unit}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
