'use client';
import { useState, useEffect } from 'react';
import { useUploadThing } from '@/utils/uploadthing';
import {
  DocumentTextIcon,
  ArrowSmallRightIcon,
  ArrowSmallLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import FileUploader from '../ui/FileUploader';

export default function StockModalAdd({ onClose, onAdd }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    category: '',
    unit: '',
    quantity: '',
    unit_price: '',
    min_quantity: '',
    max_quantity: '',
    location_id: '',
    supplier_id: '',
    description: '',
    status: 'active',
    documents: []
  });

  const { startUpload } = useUploadThing("stockDocumentUploader");

  // Charger les fournisseurs et emplacements
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, locationsRes] = await Promise.all([
          fetch('/api/stock/suppliers'),
          fetch('/api/stock/locations')
        ]);

        if (!suppliersRes.ok || !locationsRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const suppliersData = await suppliersRes.json();
        const locationsData = await locationsRes.json();

        setSuppliers(suppliersData);
        setLocations(locationsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUploadComplete = (uploadedFiles) => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...uploadedFiles]
    }));
  };

  const isStepValid = () => {
    const currentFields = steps[currentStep - 1].fields;
    return currentFields.every(field => {
      if (field === 'documents') return true;
      return formData[field]?.toString().trim() !== '';
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Créer la référence si elle n'existe pas
      if (!formData.reference) {
        formData.reference = `${formData.category.substring(0, 3).toUpperCase()}-${Date.now()}`;
      }

      // Convertir les valeurs numériques
      const dataToSubmit = {
        ...formData,
        quantity: Number(formData.quantity),
        unit_price: Number(formData.unit_price),
        min_quantity: Number(formData.min_quantity),
        max_quantity: Number(formData.max_quantity),
        supplier_id: formData.supplier_id ? Number(formData.supplier_id) : null,
        documents: formData.documents.map(doc => doc.url) // On envoie uniquement les URLs
      };

      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de l\'article');
      }

      const newItem = await response.json();
      onAdd(newItem);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Informations de base',
      description: 'Nom, catégorie et unité de mesure',
      fields: ['name', 'category', 'unit']
    },
    {
      title: 'Quantités et prix',
      description: 'Stock initial et valeurs',
      fields: ['quantity', 'unit_price', 'min_quantity', 'max_quantity']
    },
    {
      title: 'Localisation et fournisseur',
      description: 'Emplacement et source',
      fields: ['location_id', 'supplier_id']
    },
    {
      title: 'Détails supplémentaires',
      description: 'Description et documents',
      fields: ['description', 'documents']
    }
  ];

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime p-2 dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
          rows="4"
          placeholder="Description détaillée du matériau..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Documents
        </label>
        <FileUploader 
          onUploadComplete={handleUploadComplete}
          isLoading={loading}
        />
        {formData.documents.length > 0 && (
          <ul className="mt-4 space-y-2">
            {formData.documents.map((file, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pro-lime"
                >
                  {file.name}
                </a>
                <button
                  onClick={() => {
                    const newDocs = [...formData.documents];
                    newDocs.splice(index, 1);
                    setFormData(prev => ({ ...prev, documents: newDocs }));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700  dark:text-gray-300 mb-2">
                Nom du matériau
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: Ciment Portland"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="raw">Matières premières</option>
                <option value="finished">Produits finis</option>
                <option value="packaging">Emballages</option>
                <option value="equipment">Équipements</option>
                <option value="tools">Outillage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unité de mesure
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                <option value="">Sélectionner une unité</option>
                <option value="kg">Kilogrammes</option>
                <option value="g">Grammes</option>
                <option value="l">Litres</option>
                <option value="ml">Millilitres</option>
                <option value="units">Unités</option>
                <option value="boxes">Boîtes</option>
                <option value="pallets">Palettes</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantité initiale
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: 100"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix unitaire (FCFA)
              </label>
              <input
                type="number"
                value={formData.unit_price}
                onChange={(e) => handleInputChange('unit_price', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: 5000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seuil minimum
              </label>
              <input
                type="number"
                value={formData.min_quantity}
                onChange={(e) => handleInputChange('min_quantity', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: 20"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seuil maximum
              </label>
              <input
                type="number"
                value={formData.max_quantity}
                onChange={(e) => handleInputChange('max_quantity', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: 1000"
                min="0"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emplacement
              </label>
              <select
                value={formData.location_id}
                onChange={(e) => handleInputChange('location_id', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                <option value="">Sélectionner un emplacement</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fournisseur
              </label>
              <select
                value={formData.supplier_id}
                onChange={(e) => handleInputChange('supplier_id', e.target.value)}
                className="block w-full rounded-lg p-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
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
        );
      case 4:
        return renderDocumentsStep();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-auto">
      {error && (
        <div className="px-6 py-4 bg-red-100 border border-red-400 text-red-700 rounded-t-lg">
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Ajouter un nouveau matériau
        </h2>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index + 1
                    ? 'bg-pro-lime text-white'
                    : currentStep === index + 1
                    ? 'bg-pro-lime/20 text-pro-lime border-2 border-pro-lime'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                {currentStep > index + 1 ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {steps[currentStep - 1].title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {steps[currentStep - 1].description}
          </p>
        </div>
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(prev => prev - 1)}
          className={`btn btn-secondary p-1 rounded-xl hover:p-2 flex items-center space-x-2 ${
            currentStep === 1 ? 'invisible' : ''
          }`}
          disabled={loading}
        >
          <ArrowSmallLeftIcon className="w-5 h-5" />
          <span>Précédent</span>
        </button>
        
        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!isStepValid() || loading}
            className="btn btn-primary p-1 rounded-xl hover:p-2 flex items-center space-x-2"
          >
            <span>Suivant</span>
            <ArrowSmallRightIcon className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isStepValid() || loading}
            className="btn btn-primary p-1 rounded-xl hover:p-2 flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white"></div>
            ) : (
              <CheckIcon className="w-5 h-5" />
            )}
            <span>{loading ? 'Création...' : 'Terminer'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
