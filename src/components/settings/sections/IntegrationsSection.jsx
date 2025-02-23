'use client';

import { motion } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  CloudIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import ToggleOption from '../components/ToggleOption';

export default function IntegrationsSection({ onToggle, integrationSettings = {} }) {
  const integrations = [
    {
      id: 'google',
      name: 'Google Workspace',
      description: 'Synchronisation avec Google Calendar et Drive',
      icon: CloudIcon,
      connected: true,
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Notifications et partage de fichiers',
      icon: ChatBubbleLeftIcon,
      connected: false,
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-300'
    },
    {
      id: 'office365',
      name: 'Microsoft 365',
      description: 'Intégration avec Office et Teams',
      icon: DocumentIcon,
      connected: false,
      bgColor: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-300'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Planification de réunions',
      icon: CalendarIcon,
      connected: true,
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300'
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
          Intégrations disponibles
        </h3>
        <div className="space-y-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${integration.bgColor}`}>
                  <integration.icon className={`w-6 h-6 ${integration.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {integration.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {integration.description}
                  </p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  integration.connected
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                    : 'bg-pro-lime text-white hover:bg-pro-lime-dark'
                }`}
              >
                {integration.connected ? 'Configurer' : 'Connecter'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Paramètres d'intégration
        </h3>
        <div className="space-y-6">
          <ToggleOption
            icon={WrenchScrewdriverIcon}
            title="Synchronisation automatique"
            description="Synchroniser automatiquement les données avec les services connectés"
            bgColor="bg-indigo-100 dark:bg-indigo-900"
            iconColor="text-indigo-600 dark:text-indigo-300"
            enabled={integrationSettings.autoSync}
            onToggle={() => onToggle('autoSync')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fréquence de synchronisation
            </label>
            <select
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
              defaultValue="hourly"
            >
              <option value="realtime">Temps réel</option>
              <option value="hourly">Toutes les heures</option>
              <option value="daily">Une fois par jour</option>
              <option value="weekly">Une fois par semaine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Limite de données
            </label>
            <select
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
              defaultValue="1000"
            >
              <option value="100">100 éléments</option>
              <option value="500">500 éléments</option>
              <option value="1000">1000 éléments</option>
              <option value="unlimited">Illimité</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Historique des synchronisations
        </h3>
        <div className="space-y-4">
          {[
            {
              service: 'Google Calendar',
              status: 'Succès',
              date: 'Il y a 5 minutes',
              items: '42 événements'
            },
            {
              service: 'Slack',
              status: 'Échec',
              date: 'Il y a 1 heure',
              items: '0 messages',
              error: 'Erreur de connexion'
            },
            {
              service: 'Zoom',
              status: 'Succès',
              date: 'Il y a 3 heures',
              items: '12 réunions'
            }
          ].map((sync, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {sync.service}
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      sync.status === 'Succès'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {sync.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {sync.date} • {sync.items}
                </p>
                {sync.error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {sync.error}
                  </p>
                )}
              </div>
              <button className="text-pro-lime hover:text-pro-lime-dark text-sm font-medium">
                Détails
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 