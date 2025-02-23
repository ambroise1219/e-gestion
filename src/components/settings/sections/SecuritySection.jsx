'use client';

import { motion } from 'framer-motion';
import { KeyIcon, ShieldCheckIcon, LockClosedIcon, FingerPrintIcon } from '@heroicons/react/24/outline';
import ToggleOption from '../components/ToggleOption';

export default function SecuritySection({ onToggle, securitySettings = {} }) {
  const securityOptions = [
    {
      id: 'twoFactor',
      icon: KeyIcon,
      title: 'Authentification à deux facteurs',
      description: 'Ajouter une couche de sécurité supplémentaire',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300'
    },
    {
      id: 'biometric',
      icon: FingerPrintIcon,
      title: 'Authentification biométrique',
      description: 'Utiliser votre empreinte digitale ou Face ID',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-300'
    },
    {
      id: 'sessionTimeout',
      icon: LockClosedIcon,
      title: 'Expiration de session',
      description: 'Déconnexion automatique après inactivité',
      bgColor: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-300'
    },
    {
      id: 'loginAlerts',
      icon: ShieldCheckIcon,
      title: 'Alertes de connexion',
      description: 'Notifications des nouvelles connexions',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      iconColor: 'text-yellow-600 dark:text-yellow-300'
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
          Sécurité du compte
        </h3>
        <div className="space-y-6">
          {securityOptions.map((option) => (
            <ToggleOption
              key={option.id}
              {...option}
              enabled={securitySettings[option.id]}
              onToggle={() => onToggle(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Mot de passe
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ancien mot de passe
            </label>
            <input
              type="password"
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
            />
          </div>
          <button className="mt-4 w-full bg-pro-lime text-white py-2 px-4 rounded-lg hover:bg-pro-lime-dark transition-colors">
            Mettre à jour le mot de passe
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Sessions actives
        </h3>
        <div className="space-y-4">
          {[
            {
              device: 'Windows PC',
              location: 'Paris, France',
              lastActive: 'Actuellement actif',
              isCurrent: true
            },
            {
              device: 'iPhone 13',
              location: 'Lyon, France',
              lastActive: 'Il y a 2 heures'
            },
            {
              device: 'MacBook Pro',
              location: 'Marseille, France',
              lastActive: 'Il y a 3 jours'
            }
          ].map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.device}
                  {session.isCurrent && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Actuel
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {session.location} • {session.lastActive}
                </p>
              </div>
              {!session.isCurrent && (
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Déconnecter
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 