'use client';

import { motion } from 'framer-motion';
import { GlobeAltIcon, TranslateIcon, ClockIcon } from '@heroicons/react/24/outline';
import ToggleOption from '../components/ToggleOption';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];

const timezones = [
  { value: 'Europe/Paris', label: 'Paris (UTC+1)', region: 'Europe' },
  { value: 'Europe/London', label: 'Londres (UTC+0)', region: 'Europe' },
  { value: 'America/New_York', label: 'New York (UTC-5)', region: 'Amérique' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8)', region: 'Amérique' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)', region: 'Asie' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+4)', region: 'Asie' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+11)', region: 'Océanie' }
];

const dateFormats = [
  { value: 'DD/MM/YYYY', label: '31/12/2023', region: 'Europe' },
  { value: 'MM/DD/YYYY', label: '12/31/2023', region: 'Amérique' },
  { value: 'YYYY-MM-DD', label: '2023-12-31', region: 'International' }
];

const timeFormats = [
  { value: '24h', label: '23:59', description: 'Format 24 heures' },
  { value: '12h', label: '11:59 PM', description: 'Format 12 heures' }
];

export default function LanguageSection({ 
  language = 'fr',
  timezone = 'Europe/Paris',
  dateFormat = 'DD/MM/YYYY',
  timeFormat = '24h',
  autoDetect = true,
  onSave,
  onToggle 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Langue de l'interface
        </h3>
        <div className="space-y-6">
          <ToggleOption
            icon={GlobeAltIcon}
            title="Détecter automatiquement"
            description="Utiliser la langue du navigateur"
            bgColor="bg-blue-100 dark:bg-blue-900"
            iconColor="text-blue-600 dark:text-blue-300"
            enabled={autoDetect}
            onToggle={() => onToggle('autoDetect')}
          />

          <div className="grid grid-cols-2 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSave('language', lang.code)}
                className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                  language === lang.code
                    ? 'bg-pro-lime text-white'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Paramètres régionaux
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fuseau horaire
            </label>
            <select
              value={timezone}
              onChange={(e) => onSave('timezone', e.target.value)}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime"
            >
              {Object.entries(
                timezones.reduce((acc, tz) => {
                  if (!acc[tz.region]) acc[tz.region] = [];
                  acc[tz.region].push(tz);
                  return acc;
                }, {})
              ).map(([region, tzs]) => (
                <optgroup key={region} label={region}>
                  {tzs.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format de date
            </label>
            <div className="grid grid-cols-3 gap-4">
              {dateFormats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => onSave('dateFormat', format.value)}
                  className={`p-3 rounded-lg text-sm transition-colors ${
                    dateFormat === format.value
                      ? 'bg-pro-lime text-white'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs opacity-75">{format.region}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format de l'heure
            </label>
            <div className="grid grid-cols-2 gap-4">
              {timeFormats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => onSave('timeFormat', format.value)}
                  className={`p-4 rounded-lg text-sm transition-colors ${
                    timeFormat === format.value
                      ? 'bg-pro-lime text-white'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs opacity-75">{format.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Traduction
        </h3>
        <div className="prose dark:prose-invert max-w-none text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Notre système de traduction automatique est constamment amélioré pour vous offrir
            la meilleure expérience possible. Si vous trouvez des erreurs de traduction,
            n'hésitez pas à nous les signaler.
          </p>
          <div className="mt-4 space-y-2">
            <button className="text-pro-lime hover:text-pro-lime-dark font-medium">
              Contribuer à la traduction
            </button>
            <button className="block text-pro-lime hover:text-pro-lime-dark font-medium">
              Signaler une erreur de traduction
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 