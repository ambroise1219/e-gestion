'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CubeIcon,
  ArrowsUpDownIcon,
  ChartBarIcon,
  DocumentIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import StockModalTabs from './StockModalTabs';
import StockModalOverview from './StockModalOverview';
import StockModalStats from './StockModalStatistics';
import StockModalDocuments from './StockModalDocuments';
import StockModalLocations from './StockModalLocations';
import StockModalMovements from './StockModalMovements';

export default function StockModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  title,
  mode = 'view',
  initialData = null,
  item = null,
  transactions = [],
  onMovement,
  suppliers = []
}) {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    description: '',
    quantity: 0,
    unit: '',
    min_quantity: 0,
    max_quantity: 0,
    category: '',
    unit_price: 0,
    supplier_id: ''
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData || item) {
      setFormData({
        name: initialData?.name || item?.name || '',
        reference: initialData?.reference || item?.reference || '',
        description: initialData?.description || item?.description || '',
        quantity: initialData?.quantity || item?.quantity || 0,
        unit: initialData?.unit || item?.unit || '',
        min_quantity: initialData?.min_quantity || item?.min_quantity || 0,
        max_quantity: initialData?.max_quantity || item?.max_quantity || 0,
        category: initialData?.category || item?.category || '',
        unit_price: initialData?.unit_price || item?.unit_price || 0,
        supplier_id: initialData?.supplier_id || item?.supplier_id || ''
      });
    }
  }, [initialData, item]);

  if (!isOpen) return null;

  const tabs = mode === 'view' ? [
    { id: 'overview', label: 'Aperçu', icon: CubeIcon },
    { id: 'movements', label: 'Mouvements', icon: ArrowsUpDownIcon },
    { id: 'stats', label: 'Statistiques', icon: ChartBarIcon },
    { id: 'documents', label: 'Documents', icon: DocumentIcon },
    { id: 'locations', label: 'Emplacements', icon: MapPinIcon }
  ] : [];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.reference) newErrors.reference = 'La référence est requise';
    if (!formData.unit) newErrors.unit = "L'unité est requise";
    if (formData.min_quantity < 0) newErrors.min_quantity = 'La quantité minimale doit être positive';
    if (formData.max_quantity <= formData.min_quantity) {
      newErrors.max_quantity = 'La quantité maximale doit être supérieure à la quantité minimale';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convertir les valeurs numériques
    if (['quantity', 'min_quantity', 'max_quantity', 'unit_price'].includes(name)) {
      processedValue = value === '' ? 0 : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleTabChange = (tabId) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const newIndex = tabs.findIndex(tab => tab.id === tabId);
    setSlideDirection(newIndex > currentIndex ? 'right' : 'left');
    setIsAnimating(true);
    setActiveTab(tabId);
  };

  const renderContent = () => {
    if (mode === 'create' || mode === 'edit') {
      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Référence *
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${
                  errors.reference ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700`}
              />
              {errors.reference && (
                <p className="mt-1 text-sm text-red-500">{errors.reference}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </div>

          {/* Quantités et unités */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantité initiale
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unité *
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${
                  errors.unit ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700`}
              />
              {errors.unit && (
                <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantité minimum *
              </label>
              <input
                type="number"
                name="min_quantity"
                value={formData.min_quantity}
                onChange={handleInputChange}
                min="0"
                className={`w-full rounded-lg border ${
                  errors.min_quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700`}
              />
              {errors.min_quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.min_quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantité maximum *
              </label>
              <input
                type="number"
                name="max_quantity"
                value={formData.max_quantity}
                onChange={handleInputChange}
                min="0"
                className={`w-full rounded-lg border ${
                  errors.max_quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700`}
              />
              {errors.max_quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.max_quantity}</p>
              )}
            </div>
          </div>

          {/* Catégorie et prix */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="raw">Matières premières</option>
                <option value="finished">Produits finis</option>
                <option value="packaging">Emballages</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prix unitaire
              </label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fournisseur
              </label>
              <select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="">Sélectionner un fournisseur</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-pro-lime rounded-lg hover:bg-pro-lime/90"
            >
              {mode === 'create' ? 'Créer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      );
    }

    // Mode vue
    const contentClass = `transition-transform duration-300 ${
      isAnimating 
        ? slideDirection === 'right' 
          ? 'translate-x-full opacity-0' 
          : '-translate-x-full opacity-0'
        : 'translate-x-0 opacity-100'
    }`;

    return (
      <div className={contentClass}>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Informations générales
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Référence</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.reference}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Description</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.description || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Catégorie</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.category === 'raw' ? 'Matières premières' :
                       item.category === 'finished' ? 'Produits finis' :
                       item.category === 'packaging' ? 'Emballages' : '-'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Fournisseur
                </h3>
                {item.supplier_id ? (
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Nom</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.supplier_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Contact</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.supplier_contact || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Email</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.supplier_email || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Téléphone</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.supplier_phone || '-'}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aucun fournisseur associé</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Stock et prix
              </h3>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Quantité actuelle</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {item.quantity} {item.unit}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Stock minimum</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {item.min_quantity} {item.unit}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Stock maximum</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {item.max_quantity} {item.unit}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Prix unitaire</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.unit_price)}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'movements' && (
          <StockModalMovements
            transactions={transactions}
            onMovement={onMovement}
          />
        )}

        {/* Autres onglets à implémenter */}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
          {/* Header avec animation de gradient */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pro-lime/20 to-transparent dark:from-pro-lime/10" />
            <div className="flex justify-between items-center p-6 relative">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <CubeIcon className="w-8 h-8 text-pro-lime" />
                <span>{title || item?.name || 'Article'}</span>
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          {mode === 'view' && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-center space-x-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-pro-lime text-black'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation arrows */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex > 0) {
                        handleTabChange(tabs[currentIndex - 1].id);
                      }
                    }}
                    disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                    className="p-1 rounded-full text-gray-800 dark:text-white hover:bg-pro-lime dark:hover:bg-pro-lime dark:hover:text-black disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex < tabs.length - 1) {
                        handleTabChange(tabs[currentIndex + 1].id);
                      }
                    }}
                    disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
                    className="p-1 rounded-full text-gray-800 dark:text-white hover:bg-pro-lime dark:hover:bg-pro-lime dark:hover:text-black disabled:opacity-50"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content avec animation */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
