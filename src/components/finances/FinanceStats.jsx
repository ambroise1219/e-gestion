'use client';

import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

export default function FinanceStats({ transactions }) {
  // Calcul des statistiques
  const calculateStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    const pendingTransactions = transactions
      .filter(t => t.status === 'pending')
      .length;

    return {
      totalIncome,
      totalExpenses,
      balance,
      pendingTransactions
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Revenus totaux',
      value: `${stats.totalIncome} CFA`,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Dépenses totales',
      value: `${stats.totalExpenses} CFA`,
      icon: ArrowTrendingDownIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900'
    },
    {
      title: 'Balance',
      value: `${stats.balance} CFA`,
      icon: ScaleIcon,
      color: stats.balance >= 0 ? 'text-green-500' : 'text-red-500',
      bgColor: stats.balance >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
    },
    {
      title: 'Transactions en attente',
      value: stats.pendingTransactions,
      icon: BanknotesIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2"> 
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
