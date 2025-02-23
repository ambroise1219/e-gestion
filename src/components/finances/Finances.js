'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import FinanceCard from './FinanceCard';
import FinanceModalAdd from './FinanceModalAdd';
import FinanceModal from './FinanceModal';
import FinanceStats from './FinanceStats';

export default function Finances() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data pour les transactions
  const transactions = [
    {
      id: 1,
      type: 'income',
      amount: 15000,
      category: 'Ventes',
      date: '2024-01-15',
      status: 'completed',
      description: 'Paiement client ABC',
      attachments: [],
    },
    {
      id: 2,
      type: 'expense',
      amount: 5000,
      category: 'Matériaux',
      date: '2024-01-10',
      status: 'pending',
      description: 'Achat de ciment',
      attachments: [],
    },
    {
      id: 3,
      type: 'income',
      amount: 8000,
      category: 'Services',
      date: '2024-01-20',
      status: 'completed',
      description: 'Consultation',
      attachments: [],
    },
  ];

  const handleAddTransaction = (newTransaction) => {
    console.log('Nouvelle transaction:', newTransaction);
    setIsAddModalOpen(false);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-2 rounded-xl border border-pro-lime   hover:bg-pro-lime-light transition-colors duration-200 bg-pro-lime pr-2 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5 hover:animate-spin" />
          <span>Nouvelle transaction</span>
        </button>
      </div>

      {/* Statistiques */}
      <FinanceStats transactions={transactions} />

      {/* Liste des transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.map((transaction) => (
          <FinanceCard
            key={transaction.id}
            transaction={transaction}
            onClick={() => handleTransactionClick(transaction)}
          />
        ))}
      </div>

      {/* Modal d'ajout de transaction */}
      <FinanceModalAdd
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransaction}
      />

      {/* Modal de détails de transaction */}
      <FinanceModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
