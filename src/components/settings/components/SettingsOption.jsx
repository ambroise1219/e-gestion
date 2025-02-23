'use client';

import { motion } from 'framer-motion';
import ToggleSwitch from './ToggleSwitch';

export default function SettingsOption({
  icon: Icon,
  title,
  description,
  bgColor = 'bg-gray-100',
  iconColor = 'text-gray-600',
  toggle,
  onToggle,
  children
}) {
  const IconComponent = Icon ? (
    <div className={`p-2 ${bgColor} dark:bg-opacity-20 rounded-lg`}>
      <Icon className={`w-6 h-6 ${iconColor} dark:text-opacity-80`} />
    </div>
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center space-x-3">
        {IconComponent}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
      {toggle !== undefined && (
        <ToggleSwitch enabled={toggle} onChange={onToggle} />
      )}
    </motion.div>
  );
} 