'use client';

import { motion } from 'framer-motion';
import { SunIcon, SwatchIcon } from '@heroicons/react/24/outline';
import SettingsCard from '../components/SettingsCard';
import ToggleOption from '../components/ToggleOption';
import ColorPicker from '../components/ColorPicker';

const themeColors = [
  { name: 'Lime', value: '#00A36C' },
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Jaune', value: '#EAB308' }
];

const fontSizes = [
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' }
];

export default function AppearanceSection({
  darkMode,
  onDarkModeChange,
  themeColor,
  onThemeColorChange,
  fontSize,
  onFontSizeChange
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <SettingsCard
        title="Thème"
        description="Personnalisez l'apparence de l'application"
      >
        <div className="space-y-6">
          <ToggleOption
            icon={SunIcon}
            title="Mode sombre"
            description="Activer le thème sombre"
            bgColor="bg-gray-100 dark:bg-gray-900"
            iconColor="text-gray-600 dark:text-gray-300"
            enabled={darkMode}
            onToggle={onDarkModeChange}
          />

          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Couleur du thème
            </h4>
            <ColorPicker
              colors={themeColors}
              selectedColor={themeColor}
              onChange={onThemeColorChange}
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Police"
        description="Personnalisez la taille du texte"
      >
        <div className="flex space-x-4">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => onFontSizeChange(size.value)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                fontSize === size.value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </SettingsCard>
    </motion.div>
  );
} 