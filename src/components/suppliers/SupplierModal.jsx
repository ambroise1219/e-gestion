'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  BuildingOfficeIcon,
  TruckIcon,
  ChartBarIcon,
  DocumentIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import SupplierModalOverview from './SupplierModalOverview';
import SupplierOrders from './SupplierOrders';
import SupplierStats from './SupplierStats';
import SupplierDocuments from './SupplierDocuments';

export default function SupplierModal({ supplier, isOpen, onClose, isEditing, onSupplierChange, onCreateInvoice }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: BuildingOfficeIcon },
    { id: 'orders', label: 'Commandes', icon: TruckIcon },
    { id: 'stats', label: 'Statistiques', icon: ChartBarIcon },
    { id: 'documents', label: 'Documents', icon: DocumentIcon },
    { id: 'history', label: 'Historique', icon: ClockIcon }
  ];

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleTabChange = (tabId) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const newIndex = tabs.findIndex(tab => tab.id === tabId);
    setSlideDirection(newIndex > currentIndex ? 'right' : 'left');
    setIsAnimating(true);
    setActiveTab(tabId);
  };

  const handleKeyNavigation = (e) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1].id);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1].id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-pro-black rounded-xl w-full max-w-4xl shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-pro-lime dark:bg-pro-lime-dark">
                <BuildingOfficeIcon className="w-6 h-6 text-pro-black dark:text-pro-black" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {supplier.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {supplier.category}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-pro-lime text-pro-black dark:text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      activeTab === tab.id
                        ? 'text-pro-lime dark:text-pro-lime-dark'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: slideDirection === 'right' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection === 'right' ? -20 : 20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <SupplierModalOverview
                    supplier={supplier}
                    isEditing={isEditing}
                    onSupplierChange={onSupplierChange}
                    onCreateInvoice={onCreateInvoice}
                  />
                )}
                {activeTab === 'orders' && <SupplierOrders supplier={supplier} />}
                {activeTab === 'stats' && <SupplierStats supplier={supplier} />}
                {activeTab === 'documents' && <SupplierDocuments supplier={supplier} />}
                {activeTab === 'history' && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Historique des modifications</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex > 0) {
                    handleTabChange(tabs[currentIndex - 1].id);
                  }
                }}
                disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-pro-black-light disabled:opacity-50"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex < tabs.length - 1) {
                    handleTabChange(tabs[currentIndex + 1].id);
                  }
                }}
                disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-pro-black-light disabled:opacity-50"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              supplier.status === 'Active' 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
            }`}>
              {supplier.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
