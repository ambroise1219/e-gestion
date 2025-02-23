'use client';

import { motion } from 'framer-motion';

export default function SettingsTab({ tab, isActive, onClick }) {
  const Icon = tab.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-pro-lime text-white dark:text-black [&_svg]:text-white dark:[&_svg]:text-black'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <div className="flex-1 text-left">
        <div>{tab.label}</div>
        <div className="text-xs opacity-75">{tab.description}</div>
      </div>
    </motion.button>
  );
} 