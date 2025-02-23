'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  BellIcon,
  SwatchIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CogIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import SettingsTab from './components/SettingsTab';
import SavedChangesNotification from './components/SavedChangesNotification';
import ProfileSection from './sections/ProfileSection';
import NotificationsSection from './sections/NotificationsSection';
import AppearanceSection from './sections/AppearanceSection';
import SecuritySection from './sections/SecuritySection';
import WorkspaceSection from './sections/WorkspaceSection';
import IntegrationsSection from './sections/IntegrationsSection';
import AnalyticsSection from './sections/AnalyticsSection';
import LanguageSection from './sections/LanguageSection';
import SystemSection from './sections/SystemSection';

const tabs = [
  { id: 'profile', label: 'Profil', icon: UserCircleIcon, description: 'Informations personnelles et préférences' },
  { id: 'notifications', label: 'Notifications', icon: BellIcon, description: 'Gérer vos notifications' },
  { id: 'appearance', label: 'Apparence', icon: SwatchIcon, description: 'Personnaliser l\'interface' },
  { id: 'language', label: 'Langue', icon: GlobeAltIcon, description: 'Paramètres régionaux' },
  { id: 'security', label: 'Sécurité', icon: ShieldCheckIcon, description: 'Sécurité et authentification' },
  { id: 'system', label: 'Système', icon: CogIcon, description: 'Paramètres système' },
  { id: 'workspace', label: 'Espace de travail', icon: BuildingOfficeIcon, description: 'Configuration de l\'espace de travail' },
  { id: 'integrations', label: 'Intégrations', icon: WrenchScrewdriverIcon, description: 'Gérer les intégrations' },
  { id: 'analytics', label: 'Analytiques', icon: ChartBarIcon, description: 'Préférences des analytiques' }
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [savedChanges, setSavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
      position: '',
      bio: '',
      language: 'fr',
      timezone: 'Europe/Paris'
    },
    notifications: {
      email: true,
      browser: true,
      mobile: false,
      desktop: true,
      updates: true,
      security: true,
      reminders: true,
      messages: true,
      marketing: false
    },
    appearance: {
      darkMode: false,
      themeColor: '#00A36C',
      fontSize: 'medium',
      animations: true,
      compactMode: false
    },
    language: {
      language: 'fr',
      timezone: 'Europe/Paris',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      autoDetect: true
    },
    security: {
      twoFactor: false,
      biometric: false,
      sessionTimeout: true,
      loginAlerts: true
    },
    system: {
      autoUpdate: true,
      autoBackup: true,
      errorReporting: false
    },
    workspace: {
      autoBackup: true,
      collaboration: false,
      fileSharing: true
    },
    integrations: {
      autoSync: true
    },
    analytics: {
      userTracking: true,
      performance: true,
      errorReporting: false
    }
  });

  useEffect(() => {
    if (savedChanges) {
      const timer = setTimeout(() => {
        setSavedChanges(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [savedChanges]);

  const handleSettingChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setSavedChanges(true);
  };

  const renderSection = () => {
    const props = {
      ...settings[activeTab],
      onSave: (key, value) => handleSettingChange(activeTab, key, value),
      onToggle: (key) => handleSettingChange(activeTab, key, !settings[activeTab][key])
    };

    switch (activeTab) {
      case 'profile':
        return <ProfileSection {...props} />;
      case 'notifications':
        return <NotificationsSection {...props} />;
      case 'appearance':
        return <AppearanceSection {...props} />;
      case 'language':
        return <LanguageSection {...props} />;
      case 'security':
        return <SecuritySection {...props} />;
      case 'system':
        return <SystemSection {...props} />;
      case 'workspace':
        return <WorkspaceSection {...props} />;
      case 'integrations':
        return <IntegrationsSection {...props} />;
      case 'analytics':
        return <AnalyticsSection {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérer vos préférences et paramètres
          </p>
        </div>

        {savedChanges && <SavedChangesNotification />}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <SettingsTab
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="col-span-12 md:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 