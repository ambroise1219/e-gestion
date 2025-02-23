import { useState, useEffect } from 'react';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  AdjustmentsVerticalIcon
} from '@heroicons/react/24/outline';

export default function StockModalTransactionForm({ item, onSubmit, locations = [] }) {
  const [formData, setFormData] = useState({
    transaction_type: 'in',
    quantity: '',
    source_location_id: '',
    destination_location_id: '',
    reference: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const transactionTypes = [
    { id: 'in', label: 'Entrée', icon: ArrowDownTrayIcon },
    { id: 'out', label: 'Sortie', icon: ArrowUpTrayIcon },
    { id: 'adjustment_up', label: 'Ajustement +', icon: AdjustmentsVerticalIcon },
    { id: 'adjustment_down', label: 'Ajustement -', icon: AdjustmentsVerticalIcon }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'La quantité doit être supérieure à 0';
    }

    if (formData.transaction_type === 'out' && formData.quantity > item.quantity) {
      newErrors.quantity = 'Quantité insuffisante en stock';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        item_id: item.id,
        quantity: Number(formData.quantity)
      });

      // Réinitialiser le formulaire
      setFormData({
        transaction_type: 'in',
        quantity: '',
        source_location_id: '',
        destination_location_id: '',
        reference: '',
        notes: ''
      });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type de mouvement */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {transactionTypes.map(type => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, transaction_type: type.id }))}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                formData.transaction_type === type.id
                  ? 'border-pro-lime bg-pro-lime/10 text-black'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quantité et référence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantité *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="0"
            step="1"
            className={`w-full rounded-lg border ${
              errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700`}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Référence
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            placeholder="Numéro de commande, lot..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Emplacements */}
      {locations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(formData.transaction_type === 'out' || formData.transaction_type === 'adjustment_down') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emplacement source
              </label>
              <select
                name="source_location_id"
                value={formData.source_location_id}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="">Sélectionner un emplacement</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(formData.transaction_type === 'in' || formData.transaction_type === 'adjustment_up') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emplacement destination
              </label>
              <select
                name="destination_location_id"
                value={formData.destination_location_id}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="">Sélectionner un emplacement</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          placeholder="Commentaires ou informations supplémentaires..."
        />
      </div>

      {/* Message d'erreur global */}
      {errors.submit && (
        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200">
          {errors.submit}
        </div>
      )}

      {/* Boutons */}
      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-black bg-pro-lime rounded-lg hover:bg-pro-lime/90 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer le mouvement'}
        </button>
      </div>
    </form>
  );
}