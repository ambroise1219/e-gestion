'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function StockModalOverview({ material, isEditing }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Données simulées pour les tendances
  const trends = {
    month: {
      consumption: 250,
      previousConsumption: 200,
      orders: 5,
      previousOrders: 4,
      stockouts: 1,
      previousStockouts: 2,
      averageDeliveryTime: 3.5,
      previousAverageDeliveryTime: 4
    },
    quarter: {
      consumption: 750,
      previousConsumption: 600,
      orders: 15,
      previousOrders: 12,
      stockouts: 3,
      previousStockouts: 5,
      averageDeliveryTime: 3.8,
      previousAverageDeliveryTime: 4.2
    },
    year: {
      consumption: 3000,
      previousConsumption: 2400,
      orders: 60,
      previousOrders: 48,
      stockouts: 12,
      previousStockouts: 15,
      averageDeliveryTime: 4,
      previousAverageDeliveryTime: 4.5
    }
  };

  const currentTrends = trends[selectedPeriod];

  const calculateTrendPercentage = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendColor = (current, previous, inverse = false) => {
    const trend = calculateTrendPercentage(current, previous);
    if (trend === 0) return 'text-gray-500';
    return inverse 
      ? (trend > 0 ? 'text-red-500' : 'text-green-500')
      : (trend > 0 ? 'text-green-500' : 'text-red-500');
  };

  const formatTrendValue = (value) => {
    return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  const stockStatus = () => {
    const ratio = material.quantity / material.minQuantity;
    if (ratio <= 1) return { color: 'red', text: 'Critique' };
    if (ratio <= 1.5) return { color: 'yellow', text: 'Faible' };
    if (ratio >= 3) return { color: 'blue', text: 'Excédent' };
    return { color: 'green', text: 'Normal' };
  };

  const status = stockStatus();

  return (
    <div className="space-y-8">
      {/* En-tête avec sélecteur de période */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Aperçu du stock
        </h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 dark:text-white dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      {/* Carte d'état principal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              État du stock
            </h4>
            <div className="mt-2 flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                status.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                status.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
              }`}>
                {status.text}
              </span>
              {(status.color === 'red' || status.color === 'yellow') && (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {material.quantity} {material.unit}
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Seuil minimum: {material.minQuantity} {material.unit}
            </div>
          </div>
          <div className="border-l border-gray-200 dark:border-gray-700 pl-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Valeur estimée
            </h4>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })
                .format(material.quantity * material.unitPrice)}
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Prix unitaire: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })
                .format(material.unitPrice)} / {material.unit}
            </div>
          </div>
        </div>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Consommation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <ChartBarIcon className="w-8 h-8 text-gray-400" />
            <span className={getTrendColor(
              currentTrends.consumption,
              currentTrends.previousConsumption
            )}>
              {formatTrendValue(calculateTrendPercentage(
                currentTrends.consumption,
                currentTrends.previousConsumption
              ))}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {currentTrends.consumption} {material.unit}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Consommation
          </p>
        </div>

        {/* Commandes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
            <span className={getTrendColor(
              currentTrends.orders,
              currentTrends.previousOrders
            )}>
              {formatTrendValue(calculateTrendPercentage(
                currentTrends.orders,
                currentTrends.previousOrders
              ))}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {currentTrends.orders}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Commandes
          </p>
        </div>

        {/* Ruptures */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
            <span className={getTrendColor(
              currentTrends.stockouts,
              currentTrends.previousStockouts,
              true
            )}>
              {formatTrendValue(calculateTrendPercentage(
                currentTrends.stockouts,
                currentTrends.previousStockouts
              ))}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {currentTrends.stockouts}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ruptures de stock
          </p>
        </div>

        {/* Délai moyen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <ClockIcon className="w-8 h-8 text-gray-400" />
            <span className={getTrendColor(
              currentTrends.averageDeliveryTime,
              currentTrends.previousAverageDeliveryTime,
              true
            )}>
              {formatTrendValue(calculateTrendPercentage(
                currentTrends.averageDeliveryTime,
                currentTrends.previousAverageDeliveryTime
              ))}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {currentTrends.averageDeliveryTime} jours
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Délai moyen de livraison
          </p>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Informations de base
          </h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {material.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Référence: {material.reference}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {material.location || 'Non assigné'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Emplacement principal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {material.supplier || 'Non spécifié'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fournisseur principal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {material.responsibles?.join(', ') || 'Non assigné'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Responsables
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seuils et alertes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Seuils et alertes
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Niveau de stock
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.round((material.quantity / material.maxQuantity) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${
                    status.color === 'red' ? 'bg-red-500' :
                    status.color === 'yellow' ? 'bg-yellow-500' :
                    status.color === 'green' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${(material.quantity / material.maxQuantity) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Min: {material.minQuantity} {material.unit}</span>
                <span>Max: {material.maxQuantity} {material.unit}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Alertes actives
              </h5>
              <div className="space-y-2">
                {status.color === 'red' && (
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span className="text-sm">Stock sous le seuil minimal</span>
                  </div>
                )}
                {status.color === 'yellow' && (
                  <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span className="text-sm">Stock proche du seuil minimal</span>
                  </div>
                )}
                {status.color === 'blue' && (
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span className="text-sm">Stock excédentaire</span>
                  </div>
                )}
                {currentTrends.stockouts > currentTrends.previousStockouts && (
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <ArrowTrendingUpIcon className="w-5 h-5" />
                    <span className="text-sm">Augmentation des ruptures de stock</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
