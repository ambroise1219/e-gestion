'use client';

import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  UsersIcon,
  FolderIcon,
  CloudArrowUpIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import ToggleOption from '../components/ToggleOption';

export default function WorkspaceSection({ onToggle, workspaceSettings = {} }) {
  const workspaceOptions = [
    {
      id: 'autoBackup',
      icon: CloudArrowUpIcon,
      title: 'Sauvegarde automatique',
      description: 'Sauvegarder automatiquement les modifications',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300'
    },
    {
      id: 'collaboration',
      icon: UsersIcon,
      title: 'Mode collaboration',
      description: 'Permettre l\'édition simultanée',
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300'
    },
    {
      id: 'fileSharing',
      icon: FolderIcon,
      title: 'Partage de fichiers',
      description: 'Autoriser le partage de fichiers',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-300'
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
          Informations de l'espace de travail
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de l'espace de travail
            </label>
            <input
              type="text"
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
              placeholder="Mon espace de travail"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
              rows={3}
              placeholder="Description de votre espace de travail..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Paramètres de l'espace de travail
        </h3>
        <div className="space-y-6">
          {workspaceOptions.map((option) => (
            <ToggleOption
              key={option.id}
              {...option}
              enabled={workspaceSettings[option.id]}
              onToggle={() => onToggle(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Stockage et quotas
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Espace utilisé</span>
              <span>75% (15 GB sur 20 GB)</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-pro-lime h-2 rounded-full"
                style={{ width: '75%' }}
              />
            </div>
          </div>
          <button className="text-pro-lime hover:text-pro-lime-dark text-sm font-medium">
            Augmenter l'espace de stockage
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Membres de l'espace de travail
        </h3>
        <div className="space-y-4">
          {[
            {
              name: 'Jean Dupont',
              email: 'jean@example.com',
              role: 'Administrateur',
              avatar: 'https://via.placeholder.com/40'
            },
            {
              name: 'Marie Martin',
              email: 'marie@example.com',
              role: 'Éditeur',
              avatar: 'https://via.placeholder.com/40'
            },
            {
              name: 'Pierre Durand',
              email: 'pierre@example.com',
              role: 'Lecteur',
              avatar: 'https://via.placeholder.com/40'
            }
          ].map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  className="text-sm rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
                  defaultValue={member.role.toLowerCase()}
                >
                  <option value="admin">Administrateur</option>
                  <option value="editor">Éditeur</option>
                  <option value="viewer">Lecteur</option>
                </select>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Retirer
                </button>
              </div>
            </div>
          ))}
          <button className="mt-4 w-full bg-pro-lime text-white py-2 px-4 rounded-lg hover:bg-pro-lime-dark transition-colors">
            Inviter un membre
          </button>
        </div>
      </div>
    </motion.div>
  );
} 