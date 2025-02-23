'use client';

import { motion } from 'framer-motion';
import {
  CogIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import ToggleOption from '../components/ToggleOption';

export default function SystemSection({ onToggle, systemSettings = {} }) {
  const systemOptions = [
    {
      id: 'autoUpdate',
      icon: ArrowPathIcon,
      title: 'Mises à jour automatiques',
      description: 'Installer automatiquement les mises à jour',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300'
    },
    {
      id: 'autoBackup',
      icon: CloudArrowUpIcon,
      title: 'Sauvegarde automatique',
      description: 'Sauvegarder les données régulièrement',
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300'
    },
    {
      id: 'errorReporting',
      icon: ShieldCheckIcon,
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
          Paramètres système
        </h3>
        <div className="space-y-6">
          {systemOptions.map((option) => (
            <ToggleOption
              key={option.id}
              {...option}
              enabled={systemSettings[option.id]}
              onToggle={() => onToggle(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Performances
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Utilisation CPU</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-pro-lime h-2 rounded-full"
                style={{ width: '45%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Mémoire utilisée</span>
              <span>2.5 GB / 8 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-pro-lime h-2 rounded-full"
                style={{ width: '31%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Espace disque</span>
              <span>156 GB / 512 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-pro-lime h-2 rounded-full"
                style={{ width: '30%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Maintenance
        </h3>
        <div className="space-y-4">
          <button className="w-full bg-pro-lime text-white py-2 px-4 rounded-lg hover:bg-pro-lime-dark transition-colors">
            Vérifier les mises à jour
          </button>
          
          <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Optimiser la base de données
          </button>
          
          <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Vider le cache
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Journal système
        </h3>
        <div className="space-y-4">
          {[
            {
              type: 'info',
              message: 'Mise à jour système installée avec succès',
              date: 'Il y a 2 heures'
            },
            {
              type: 'warning',
              message: 'Espace disque faible sur le serveur de sauvegarde',
              date: 'Il y a 5 heures'
            },
            {
              type: 'error',
              message: 'Échec de la synchronisation avec le serveur distant',
              date: 'Il y a 1 jour'
            }
          ].map((log, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div
                className={`w-2 h-2 mt-2 rounded-full ${
                  log.type === 'info'
                    ? 'bg-blue-500'
                    : log.type === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {log.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {log.date}
                </p>
              </div>
            </div>
          ))}
          <button className="text-pro-lime hover:text-pro-lime-dark text-sm font-medium">
            Voir tous les journaux
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          À propos
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Version</span>
            <span className="font-medium">2.1.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Build</span>
            <span className="font-medium">#12345</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Environnement</span>
            <span className="font-medium">Production</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500 dark:text-gray-400">Dernière mise à jour</span>
            <span className="font-medium">01/01/2024</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 