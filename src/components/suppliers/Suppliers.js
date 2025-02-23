import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import SupplierStats from './SupplierStats';
import SupplierCard from './SupplierCard';
import SupplierModal from './SupplierModal';
import SupplierModalAdd from './SupplierModalAdd';
import SupplierInvoice from './SupplierInvoice';
import SupplierPurchaseOrder from './SupplierPurchaseOrder';

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPurchaseOrderModal, setShowPurchaseOrderModal] = useState(false);

  // Données de test (à remplacer par des données réelles)
  const suppliers = [
    {
      id: 1,
      name: 'Construction Plus',
      category: 'Matériaux de construction',
      status: 'Active',
      phone: '+33 1 23 45 67 89',
      email: 'contact@constructionplus.fr',
      address: '15 rue de la Construction, 75001 Paris',
      siret: '123 456 789 00001',
      vatNumber: 'FR 12 345678901',
      activeOrders: 5,
      totalOrders: 127,
      ordersTrend: 8,
      activeOrdersValue: 45000,
      averageDeliveryTime: 4.5,
      conformityRate: 98,
      totalDeliveries: 156
    },
    {
      id: 2,
      name: 'Bois & Cie',
      category: 'Bois et dérivés',
      status: 'Active',
      phone: '+33 1 98 76 54 32',
      email: 'contact@boisetcie.fr',
      address: '42 avenue du Bois, 69002 Lyon',
      siret: '987 654 321 00001',
      vatNumber: 'FR 98 765432101',
      activeOrders: 3,
      totalOrders: 89,
      ordersTrend: -2,
      activeOrdersValue: 28000,
      averageDeliveryTime: 3.8,
      conformityRate: 95,
      totalDeliveries: 89
    },
    {
      id: 3,
      name: 'Metal Pro',
      category: 'Métallurgie',
      status: 'Inactive',
      phone: '+33 3 45 67 89 01',
      email: 'contact@metalpro.fr',
      address: '8 rue de l\'Acier, 59000 Lille',
      siret: '456 789 123 00001',
      vatNumber: 'FR 45 678912301',
      activeOrders: 0,
      totalOrders: 234,
      ordersTrend: 0,
      activeOrdersValue: 0,
      averageDeliveryTime: 5.2,
      conformityRate: 92,
      totalDeliveries: 234
    }
  ];

  const stats = {
    activeSuppliers: suppliers.filter(s => s.status === 'Active').length,
    totalSuppliers: suppliers.length,
    activeOrders: suppliers.reduce((sum, s) => sum + s.activeOrders, 0),
    ordersTrend: 12,
    totalBudget: 840000,
    budgetTrend: -2,
    averageDelay: 4.2,
    activeOrdersValue: suppliers.reduce((sum, s) => sum + s.activeOrdersValue, 0),
    averageDeliveryTime: suppliers.reduce((sum, s) => sum + s.averageDeliveryTime, 0) / suppliers.length,
    conformityRate: Math.round(suppliers.reduce((sum, s) => sum + s.conformityRate, 0) / suppliers.length),
    totalDeliveries: suppliers.reduce((sum, s) => sum + s.totalDeliveries, 0)
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierModal(true);
  };

  return (
    <div className="min-h-screen bg-pro-dark p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fournisseurs</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
              Gérez vos fournisseurs, factures et bons de commande
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-pro-lime hover:bg-pro-lime/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pro-lime"
            >
              Ajouter un fournisseur
            </button>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-pro-lime hover:bg-pro-lime/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pro-lime"
              disabled={!selectedSupplier}
            >
              Créer une facture
            </button>
            <button
              onClick={() => setShowPurchaseOrderModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-pro-lime hover:bg-pro-lime/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pro-lime"
              disabled={!selectedSupplier}
            >
              Créer un bon de commande
            </button>
          </div>
        </div>

        <SupplierStats stats={stats} className="mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-3 sm:space-y-0 mb-6">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher un fournisseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              Filtrer
            </button>

            {isFilterMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      filterStatus === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } hover:bg-gray-50`}
                    onClick={() => {
                      setFilterStatus('all');
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    Tous les statuts
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      filterStatus === 'Active' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } hover:bg-gray-50`}
                    onClick={() => {
                      setFilterStatus('Active');
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    Actifs
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      filterStatus === 'Inactive' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } hover:bg-gray-50`}
                    onClick={() => {
                      setFilterStatus('Inactive');
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    Inactifs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onClick={handleSupplierClick}
            />
          ))}
        </div>
      </div>

      {/* Modales */}
      {showSupplierModal && (
        <SupplierModal
          supplier={selectedSupplier}
          isOpen={showSupplierModal}
          onClose={() => setShowSupplierModal(false)}
          onCreateInvoice={() => setShowInvoiceModal(true)}
        />
      )}

      {showAddModal && (
        <SupplierModalAdd
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showInvoiceModal && (
        <SupplierInvoice
          supplier={selectedSupplier}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      {showPurchaseOrderModal && (
        <SupplierPurchaseOrder
          supplier={selectedSupplier}
          isOpen={showPurchaseOrderModal}
          onClose={() => setShowPurchaseOrderModal(false)}
        />
      )}
    </div>
  );
}