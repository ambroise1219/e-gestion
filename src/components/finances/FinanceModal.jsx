'use client';

import { useState } from 'react';
import { 
  XMarkIcon, 
  CurrencyEuroIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinanceModal({ transaction, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
  const amountBg = isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900';
  const statusColor = transaction.status === 'completed' 
    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: CurrencyEuroIcon },
    { id: 'details', label: 'Détails', icon: DocumentTextIcon },
    { id: 'contact', label: 'Contact', icon: UserIcon },
    { id: 'history', label: 'Historique', icon: CalendarIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg ${amountBg}`}>
                    <BanknotesIcon className={`w-6 h-6 ${amountColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Montant</h3>
                    <p className={`text-2xl font-bold ${amountColor}`}>
                      {isIncome ? '+' : '-'}{transaction.amount} {transaction.currency}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">TVA ({transaction.taxRate}%)</span>
                    <span className="text-gray-900 dark:text-white">{transaction.taxAmount} {transaction.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Compte bancaire</span>
                    <span className="text-gray-900 dark:text-white">{transaction.bankAccount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Référence bancaire</span>
                    <span className="text-gray-900 dark:text-white">{transaction.bankReference}</span>
                  </div>
                  {transaction.checkNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">N° de chèque</span>
                      <span className="text-gray-900 dark:text-white">{transaction.checkNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <CreditCardIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paiement</h3>
                    <p className="text-gray-500 dark:text-gray-400">{transaction.paymentMethod}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Date</span>
                    <span className="text-gray-900 dark:text-white">{transaction.paymentDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Échéance</span>
                    <span className="text-gray-900 dark:text-white">{transaction.dueDate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {transaction.recurringPayment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <ArrowPathIcon className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paiement récurrent</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Fréquence: {transaction.frequency}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 'details':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations détaillées</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Catégorie</label>
                  <p className="text-gray-900 dark:text-white font-medium">{transaction.mainCategory} - {transaction.subCategory}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white">{transaction.description}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Notes internes</label>
                  <p className="text-gray-900 dark:text-white">{transaction.notes}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Code comptable</label>
                  <p className="text-gray-900 dark:text-white font-mono">{transaction.accountingCode}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Catégorie budgétaire</label>
                  <p className="text-gray-900 dark:text-white">{transaction.budgetCategory}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Code projet</label>
                  <p className="text-gray-900 dark:text-white">{transaction.projectCode}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Code département</label>
                  <p className="text-gray-900 dark:text-white">{transaction.departmentCode}</p>
                </div>
                {transaction.tags && transaction.tags.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {transaction.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {transaction.attachments?.length > 0 && (
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents joints</h3>
                <div className="space-y-2">
                  {transaction.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors cursor-pointer"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                  <UserIcon className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{transaction.contactName}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{transaction.contactType}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">{transaction.contactEmail}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Téléphone</label>
                  <p className="text-gray-900 dark:text-white">{transaction.contactPhone}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'history':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Historique de la transaction</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
                <div className="space-y-6">
                  <div className="relative flex items-center space-x-4">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="ml-12">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Création</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Par: {transaction.createdBy} le {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {transaction.approvedBy && (
                    <div className="relative flex items-center space-x-4">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <CheckIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="ml-12">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Approbation</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Par: {transaction.approvedBy}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-gray-50 dark:bg-gray-800 rounded-xl max-w-4xl w-full overflow-hidden shadow-xl"
            >
              {/* Header avec gradient animé */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pro-lime/20 via-transparent to-pro-lime/20 animate-gradient-x" />
                <div className="flex justify-between items-center p-6 relative">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${amountBg}`}>
                      <CurrencyEuroIcon className={`w-8 h-8 ${amountColor}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {transaction.mainCategory}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Référence: {transaction.reference}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-pro-lime text-black'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {renderTabContent()}
                </AnimatePresence>
              </div>

              {/* Footer avec statut */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                  {transaction.status === 'completed' ? 'Terminé' : 'En attente'}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dernière modification: {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}