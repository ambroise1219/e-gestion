'use client';

import { motion } from 'framer-motion';
import {
  CloudArrowUpIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import SettingsCard from '../components/SettingsCard';

export default function ProfileSection({
  name = '',
  email = '',
  phone = '',
  position = '',
  bio = '',
  onSave
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <SettingsCard>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src="https://via.placeholder.com/100"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group-hover:scale-110 transform duration-200">
              <CloudArrowUpIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Modifier
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Photo de profil</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              JPG, GIF ou PNG. Taille maximale de 2MB.
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Informations personnelles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => onSave('name', e.target.value)}
                className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email professionnel
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => onSave('email', e.target.value)}
                className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => onSave('phone', e.target.value)}
                className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
                placeholder="+33 6 XX XX XX XX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Poste
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={position}
                onChange={(e) => onSave('position', e.target.value)}
                className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
                placeholder="Chef de projet"
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Bio">
        <div className="space-y-4">
          <textarea
            value={bio}
            onChange={(e) => onSave('bio', e.target.value)}
            className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
            rows={4}
            placeholder="Quelques mots à propos de vous..."
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bref résumé de votre profil professionnel. Apparaîtra sur votre page de profil.
          </p>
        </div>
      </SettingsCard>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-pro-lime text-white rounded-lg hover:bg-pro-lime-dark transition-colors"
        >
          Enregistrer les modifications
        </button>
      </div>
    </motion.div>
  );
} 