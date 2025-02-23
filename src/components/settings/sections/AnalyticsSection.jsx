'use client';

import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import ToggleOption from '../components/ToggleOption';

export default function AnalyticsSection({ onToggle, analyticsSettings = {} }) {
  const analyticsOptions = [
    {
      id: 'userTracking',
      icon: EyeIcon,
      title: 'Suivi utilisateur',
      description: 'Collecter des données sur l\'utilisation',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300'
    },
    {
      id: 'performance',
      icon: ChartBarIcon,
      title: 'Mesures de performance',
      description: 'Suivre les performances de l\'application',
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300'
    },
    {
      id: 'errorReporting',
      icon: DocumentChartBarIcon,
      title: 'Rapport d\'erreurs',
      description: 'Envoyer des rapports d\'erreurs anonymes',
      bgColor: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-300'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Paramètres d'analytique
        </h3>
        <div className="space-y-6">
          {analyticsOptions.map((option) => (
            <ToggleOption
              key={option.id}
              {...option}
              enabled={analyticsSettings[option.id]}
              onToggle={() => onToggle(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Résumé des données
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: UserGroupIcon,
              title: 'Utilisateurs actifs',
              value: '1,234',
              change: '+12%',
              positive: true
            },
            {
              icon: ClockIcon,
              title: 'Temps moyen de session',
              value: '24m',
              change: '-5%',
              positive: false
            },
            {
              icon: DocumentChartBarIcon,
              title: 'Erreurs signalées',
              value: '23',
              change: '-34%',
              positive: true
            },
            {
              icon: ChartBarIcon,
              title: 'Taux de conversion',
              value: '3.2%',
              change: '+2.1%',
              positive: true
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                  <stat.icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {stat.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <span
                      className={`text-sm font-medium ${
                        stat.positive
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Exportation des données
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format d'export
            </label>
            <select
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
              defaultValue="csv"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xlsx">Excel (XLSX)</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Période
            </label>
            <select
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
              defaultValue="last30"
            >
              <option value="last7">7 derniers jours</option>
              <option value="last30">30 derniers jours</option>
              <option value="last90">90 derniers jours</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          <button className="w-full bg-pro-lime text-white py-2 px-4 rounded-lg hover:bg-pro-lime-dark transition-colors">
            Exporter les données
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Confidentialité des données
        </h3>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nous prenons la confidentialité de vos données très au sérieux. Toutes les données
            collectées sont anonymisées et stockées de manière sécurisée. Vous pouvez à tout
            moment désactiver la collecte de données ou demander leur suppression.
          </p>
          <div className="mt-4 space-y-2">
            <button className="text-pro-lime hover:text-pro-lime-dark text-sm font-medium">
              Politique de confidentialité
            </button>
            <button className="block text-red-600 hover:text-red-800 text-sm font-medium">
              Supprimer toutes les données
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 