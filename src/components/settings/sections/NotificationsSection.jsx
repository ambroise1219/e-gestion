'use client';

import { motion } from 'framer-motion';
import {
  BellIcon,
  DocumentDuplicateIcon,
  DevicePhoneMobileIcon,
  CogIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import SettingsCard from '../components/SettingsCard';
import ToggleOption from '../components/ToggleOption';

export default function NotificationsSection({ onToggle, onSave, ...settings }) {
  const notificationChannels = [
    {
      id: 'email',
      icon: BellIcon,
      title: 'Notifications par email',
      description: 'Recevoir des mises à jour par email',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300'
    },
    {
      id: 'browser',
      icon: DocumentDuplicateIcon,
      title: 'Notifications du navigateur',
      description: 'Afficher des notifications dans le navigateur',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-300'
    },
    {
      id: 'mobile',
      icon: DevicePhoneMobileIcon,
      title: 'Notifications mobiles',
      description: 'Recevoir des notifications sur mobile',
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300'
    },
    {
      id: 'desktop',
      icon: CogIcon,
      title: 'Notifications bureau',
      description: 'Recevoir des notifications sur le bureau',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-300'
    }
  ];

  const notificationTypes = [
    {
      id: 'updates',
      icon: ArrowPathIcon,
      title: 'Mises à jour système',
      description: 'Notifications des mises à jour',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      iconColor: 'text-yellow-600 dark:text-yellow-300'
    },
    {
      id: 'security',
      icon: ShieldCheckIcon,
      title: 'Alertes de sécurité',
      description: 'Notifications de sécurité importantes',
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
      <SettingsCard
        title="Canaux de notification"
        description="Choisissez comment vous souhaitez recevoir vos notifications"
      >
        <div className="space-y-6">
          {notificationChannels.map((channel) => (
            <ToggleOption
              key={channel.id}
              {...channel}
              enabled={settings[channel.id]}
              onToggle={() => onToggle(channel.id)}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Types de notification"
        description="Personnalisez les types de notifications que vous souhaitez recevoir"
      >
        <div className="space-y-6">
          {notificationTypes.map((type) => (
            <ToggleOption
              key={type.id}
              {...type}
              enabled={settings[type.id]}
              onToggle={() => onToggle(type.id)}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Préférences avancées"
        description="Paramètres de notification supplémentaires"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fréquence des notifications groupées
            </label>
            <select
              value={settings.frequency}
              onChange={(e) => onSave('frequency', e.target.value)}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
            >
              <option value="instant">Instantanée</option>
              <option value="hourly">Toutes les heures</option>
              <option value="daily">Une fois par jour</option>
              <option value="weekly">Une fois par semaine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Période calme
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Début
                </label>
                <input
                  type="time"
                  value={settings.quietStart}
                  onChange={(e) => onSave('quietStart', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Fin
                </label>
                <input
                  type="time"
                  value={settings.quietEnd}
                  onChange={(e) => onSave('quietEnd', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>
    </motion.div>
  );
}