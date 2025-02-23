import { LocationManager } from '@/components/stock';

export default function StockSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Paramètres du stock
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez les configurations liées à la gestion du stock
        </p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
        <LocationManager />
      </div>
    </div>
  );
}