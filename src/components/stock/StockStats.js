import React from 'react';
import { ArrowTrendingUpIcon, CurrencyDollarIcon, ExclamationTriangleIcon, TagIcon } from '@heroicons/react/24/outline';

export default function StockStats({ stats }) {
  if (!stats) return null;

  const statCards = [
    {
      title: "Valeur totale du stock",
      value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.total_value || 0),
      icon: CurrencyDollarIcon,
      color: "bg-green-100 dark:bg-green-800",
      textColor: "text-green-800 dark:text-green-100"
    },
    {
      title: "Articles en alerte",
      value: stats.low_stock_count || 0,
      icon: ExclamationTriangleIcon,
      color: "bg-red-100 dark:bg-red-800",
      textColor: "text-red-800 dark:text-red-100"
    },
    {
      title: "Articles actifs",
      value: stats.active_items_count || 0,
      icon: TagIcon,
      color: "bg-blue-100 dark:bg-blue-800",
      textColor: "text-blue-800 dark:text-blue-100"
    },
    {
      title: "Taux de rotation",
      value: `${stats.turnover_rate || 0}%`,
      icon: ArrowTrendingUpIcon,
      color: "bg-purple-100 dark:bg-purple-800",
      textColor: "text-purple-800 dark:text-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</div>
              <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}