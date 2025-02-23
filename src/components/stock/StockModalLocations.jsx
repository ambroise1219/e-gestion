import { useState, useEffect } from 'react';
import {
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function StockModalLocations({ item }) {
  const [locations, setLocations] = useState([]);
  const [itemLocations, setItemLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    location_id: '',
    quantity: '',
    is_primary: false
  });

  // Charger les emplacements
  useEffect(() => {
    if (item?.id) {
      fetchLocations();
      fetchItemLocations();
    }
  }, [item?.id]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/stock/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchItemLocations = async () => {
    try {
      const response = await fetch(`/api/stock/locations/items?itemId=${item.id}`);
      if (!response.ok) throw new Error('Failed to fetch item locations');
      const data = await response.json();
      setItemLocations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/stock/locations/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.id,
          location_id: formData.location_id,
          quantity: Number(formData.quantity),
          is_primary: formData.is_primary
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to assign location');
      }

      const newAssignment = await response.json();
      setItemLocations(prev => [...prev, newAssignment]);
      setShowAddForm(false);
      setFormData({ location_id: '', quantity: '', is_primary: false });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (locationId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet emplacement ?')) return;

    try {
      const response = await fetch(`/api/stock/locations/items?itemId=${item.id}&locationId=${locationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove location');
      
      setItemLocations(prev => prev.filter(loc => loc.location_id !== locationId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetPrimary = async (locationId) => {
    try {
      const response = await fetch('/api/stock/locations/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.id,
          location_id: locationId,
          is_primary: true
        })
      });

      if (!response.ok) throw new Error('Failed to set primary location');

      setItemLocations(prev => prev.map(loc => ({
        ...loc,
        is_primary: loc.location_id === locationId
      })));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pro-lime"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Emplacements
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-black bg-pro-lime rounded-lg hover:bg-pro-lime/90"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Ajouter un emplacement</span>
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emplacement
              </label>
              <select
                value={formData.location_id}
                onChange={(e) => setFormData(prev => ({ ...prev, location_id: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                required
              >
                <option value="">Sélectionner un emplacement</option>
                {locations
                  .filter(loc => !itemLocations.some(il => il.location_id === loc.id))
                  .map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.type || 'Standard'})
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantité
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                min="1"
                max={item.quantity}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_primary}
                onChange={(e) => setFormData(prev => ({ ...prev, is_primary: e.target.checked }))}
                className="rounded border-gray-300 text-pro-lime focus:ring-pro-lime"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Définir comme emplacement principal
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-pro-lime rounded-lg hover:bg-pro-lime/90"
            >
              Ajouter
            </button>
          </div>
        </form>
      )}

      {/* Liste des emplacements */}
      {itemLocations.length > 0 ? (
        <div className="space-y-3">
          {itemLocations.map(location => (
            <div
              key={location.location_id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <MapPinIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {location.location_name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {location.quantity} {item.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {location.is_primary ? (
                  <StarIconSolid className="w-5 h-5 text-yellow-400" />
                ) : (
                  <button
                    onClick={() => handleSetPrimary(location.location_id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <StarIcon className="w-5 h-5 text-gray-400" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(location.location_id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Aucun emplacement
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Commencez par ajouter un emplacement pour cet article.
          </p>
        </div>
      )}
    </div>
  );
}
