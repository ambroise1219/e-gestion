import { useState, useEffect, useCallback } from 'react';

export function useStock() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/stock/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Charger les articles
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch('/api/stock');
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les emplacements
  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch('/api/stock/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    Promise.all([fetchItems(), fetchStats(), fetchLocations()]);
  }, [fetchItems, fetchStats, fetchLocations]);

  // Créer un nouvel article
  const createItem = async (data) => {
    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create item');
      }

      const newItem = await response.json();
      setItems(prev => [...prev, newItem]);
      await fetchStats();
      return newItem;
    } catch (err) {
      throw err;
    }
  };

  // Mettre à jour un article
  const updateItem = async (id, data) => {
    try {
      const response = await fetch(`/api/stock/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update item');
      }

      const updatedItem = await response.json();
      setItems(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      await fetchStats();
      return updatedItem;
    } catch (err) {
      throw err;
    }
  };

  // Supprimer un article
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`/api/stock/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete item');
      
      setItems(prev => prev.filter(item => item.id !== id));
      await fetchStats();
    } catch (err) {
      throw err;
    }
  };

  // Enregistrer un mouvement
  const recordMovement = async (data) => {
    try {
      const response = await fetch('/api/stock/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to record movement');
      }

      const transaction = await response.json();
      
      // Mettre à jour l'article concerné
      const itemResponse = await fetch(`/api/stock/${data.item_id}`);
      if (itemResponse.ok) {
        const updatedItem = await itemResponse.json();
        setItems(prev => prev.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
      }

      await fetchStats();
      return transaction;
    } catch (err) {
      throw err;
    }
  };

  // Récupérer les transactions d'un article
  const fetchTransactions = async (itemId, filters = {}) => {
    try {
      const params = new URLSearchParams({ itemId, ...filters });
      const response = await fetch(`/api/stock/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  return {
    items,
    stats,
    loading,
    error,
    locations,
    createItem,
    updateItem,
    deleteItem,
    recordMovement,
    fetchTransactions,
    refreshStats: fetchStats,
    refreshItems: fetchItems,
    refreshLocations: fetchLocations
  };
}