import React from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

// Données factices pour les dernières commandes
const dummyOrders = [
  {
    id: "CMD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    amount: 1250.80,
    items: ["Béton préfabriqué", "Ciment"],
    deliveryDate: "2024-01-18"
  },
  {
    id: "CMD-2024-002",
    date: "2024-01-20",
    status: "pending",
    amount: 3420.50,
    items: ["Acier", "Bois traité"],
    deliveryDate: "2024-01-25"
  },
  {
    id: "CMD-2024-003",
    date: "2024-01-22",
    status: "processing",
    amount: 890.30,
    items: ["Isolation thermique", "Plaques de plâtre"],
    deliveryDate: "2024-01-28"
  },
  {
    id: "CMD-2024-004",
    date: "2024-01-25",
    status: "cancelled",
    amount: 2150.00,
    items: ["Tuiles", "Gouttières"],
    deliveryDate: null
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'delivered':
      return 'Livré';
    case 'pending':
      return 'En attente';
    case 'processing':
      return 'En cours';
    case 'cancelled':
      return 'Annulé';
    default:
      return status;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered':
      return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    case 'cancelled':
      return <XCircleIcon className="h-5 w-5 text-red-600" />;
    case 'processing':
      return <ClockIcon className="h-5 w-5 text-blue-600" />;
    case 'pending':
      return <TruckIcon className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};

const SupplierModalOverview = ({ supplier, onCreateInvoice }) => {
  return (
    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Actions rapides */}
        <div className="flex justify-end space-x-4 mb-4">
          <button
            onClick={onCreateInvoice}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-pro-lime hover:bg-pro-lime/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pro-lime"
          >
            <DocumentIcon className="h-5 w-5 mr-2" />
            Créer une facture
          </button>
        </div>

        {/* Informations principales */}
        <div className="bg-white dark:bg-pro-lime rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-900">
              Informations générales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-900 dark:text-gray-800 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-900">Nom de l'entreprise</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-700 truncate">{supplier.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400 dark:text-gray-800 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-900">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-700 truncate">{supplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-800 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-900">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-700 truncate">{supplier.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 dark:text-gray-800 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-900">Adresse</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-700 truncate">{supplier.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CurrencyEuroIcon className="h-5 w-5 text-gray-400 dark:text-gray-800 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-900">SIRET</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-700 truncate">{supplier.siret}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 dark:text-gray-800 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-900">Numéro TVA</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-700 truncate">{supplier.vatNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dernières commandes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Dernières commandes
            </h3>
            <div className="space-y-4">
              {dummyOrders.map((order) => (
                <div key={order.id} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Commandé le {new Date(order.date).toLocaleDateString('fr-FR')}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Articles</p>
                      <ul className="mt-2 space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-sm text-gray-900 dark:text-white">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Montant</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                          {order.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                        </p>
                      </div>
                      {order.deliveryDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Livraison prévue
                          </p>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4 sm:p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Commandes totales</p>
              <p className="text-xl sm:text-2xl font-semibold mt-1 text-gray-900 dark:text-white">
                {supplier.totalOrders}
              </p>
              <div className="mt-2 text-sm">
                <span className={supplier.ordersTrend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {supplier.ordersTrend}% 
                </span>
                <span className="text-gray-500 dark:text-gray-400"> vs mois dernier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierModalOverview;
