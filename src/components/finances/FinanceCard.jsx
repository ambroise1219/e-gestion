import { CurrencyEuroIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function FinanceCard({ transaction, onClick }) {
  const isIncome = transaction.type === 'income';
  const statusColor = transaction.status === 'completed' ? 'text-green-500' : 'text-yellow-500';
  const amountColor = isIncome ? 'text-green-500' : 'text-red-500';

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            <CurrencyEuroIcon className={`w-6 h-6 ${isIncome ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{transaction.category}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
          </div>
        </div>
        <div className={`font-bold ${amountColor}`}>
          {isIncome ? '+' : '-'}{transaction.amount} CFA
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[70%]">
          {transaction.description}
        </p>
        <div className={`flex items-center ${statusColor}`}>
          {transaction.status === 'completed' ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <ClockIcon className="w-5 h-5" />
          )}
        </div>
      </div>
    </div>
  );
}
