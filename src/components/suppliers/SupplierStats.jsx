'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SupplierStats = ({ stats = {} }) => {
  // Données exemple pour le graphique
  const monthlyData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Fév', amount: 3000 },
    { name: 'Mar', amount: 2000 },
    { name: 'Avr', amount: 2780 },
    { name: 'Mai', amount: 1890 },
    { name: 'Juin', amount: 2390 },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-pro-lime dark:bg-pro-black p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Commandes en cours</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats?.activeOrders || 0}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Valeur totale: {stats?.activeOrdersValue?.toLocaleString('fr-FR') || 0}€
          </p>
        </div>

        <div className="bg-white dark:bg-pro-black p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Délai moyen de livraison</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats?.averageDeliveryTime?.toFixed(1) || 0} jours
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Sur les 30 derniers jours
          </p>
        </div>

        <div className="bg-white dark:bg-pro-black p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux de conformité</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats?.conformityRate || 0}%
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Basé sur {stats?.totalDeliveries || 0} livraisons
          </p>
        </div>
      </div>

      {/* Graphique des commandes */}
      <div className="bg-white dark:bg-pro-black p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Volume des commandes</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="name" stroke="#1F2937" />
              <YAxis stroke="#ccff00" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ccff00',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
                labelStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              />
              <Bar dataKey="amount" fill="#ccff00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SupplierStats;
