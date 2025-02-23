'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import StockCard from './StockCard';
import StockModal from './StockModal';
import MovementCard from './MovementCard';
import MaterialCard from './MaterialCard';
import StockStats from './StockStats';

export default function Stock() {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'active',
    supplier: 'all'
  });

  // Charger les fournisseurs
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/stock/suppliers');
      if (!response.ok) throw new Error('Failed to fetch suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  // Charger les statistiques
  useEffect(() => {
    fetchStats();
  }, [items]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stock/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Charger les articles du stock
  useEffect(() => {
    fetchStockItems();
  }, [filters]);

  const fetchStockItems = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.supplier !== 'all') queryParams.append('supplier', filters.supplier);

      const response = await fetch(`/api/stock?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch stock items');
      
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les transactions pour un article
  const fetchTransactions = async (itemId) => {
    try {
      const response = await fetch(`/api/stock/transactions?itemId=${itemId}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  // Créer un nouvel article
  const handleCreateItem = async (itemData) => {
    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) throw new Error('Failed to create item');
      
      const newItem = await response.json();
      setItems(prev => [...prev, newItem]);
      setShowAddModal(false);
      
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Mettre à jour un article
  const handleUpdateItem = async (itemId, itemData) => {
    try {
      const response = await fetch(`/api/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, ...itemData })
      });

      if (!response.ok) throw new Error('Failed to update item');
      
      const updatedItem = await response.json();
      setItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
      setShowEditModal(false);
      
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Supprimer un article
  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/stock?id=${itemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete item');
      
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Enregistrer un mouvement de stock
  const handleStockMovement = async (movementData) => {
    try {
      const response = await fetch('/api/stock/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movementData)
      });

      if (!response.ok) throw new Error('Failed to record movement');
      
      const newTransaction = await response.json();
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Mettre à jour la quantité dans la liste des articles
      fetchStockItems();
      
      return newTransaction;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CCFF00]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <button onClick={() => setError(null)}>
              <span className="sr-only">Close</span>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </span>
        </div>
      )}

      {stats && <StockStats stats={stats} />}

      {/* Header avec filtres et bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion du stock
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#CCFF00] dark:bg-pro-lime text-black rounded-lg hover:bg-[#CCFF00]/90 dark:hover:bg-pro-lime/90 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Ajouter un article</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="all">Toutes les catégories</option>
          <option value="raw">Matières premières</option>
          <option value="finished">Produits finis</option>
          <option value="packaging">Emballages</option>
        </select>
        
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="low">Stock bas</option>
          <option value="out">Rupture</option>
        </select>
        
        <select
          value={filters.supplier}
          onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="all">Tous les fournisseurs</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grille des articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <StockCard
            key={item.id}
            item={item}
            onSelect={() => {
              setSelectedItem(item);
              fetchTransactions(item.id);
            }}
            onEdit={() => {
              setSelectedItem(item);
              setShowEditModal(true);
            }}
            onDelete={() => handleDeleteItem(item.id)}
          />
        ))}
      </div>

      {/* Modals */}
      <StockModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateItem}
        title="Ajouter un article"
        mode="create"
        suppliers={suppliers}
      />
      
      <StockModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={(data) => handleUpdateItem(selectedItem?.id, data)}
        title="Modifier l'article"
        mode="edit"
        initialData={selectedItem}
        suppliers={suppliers}
      />
      
      {selectedItem && (
        <StockModal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          transactions={transactions}
          onMovement={handleStockMovement}
          mode="view"
          suppliers={suppliers}
        />
      )}
    </div>
  );
}