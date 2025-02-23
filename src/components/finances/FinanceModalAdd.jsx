'use client';

import { useState } from 'react';
import { ArrowSmallRightIcon, ArrowSmallLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FinanceModalAdd({ isOpen, onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations de base
    type: 'income',
    mainCategory: '',
    subCategory: '',
    amount: '',
    currency: 'EUR',
    
    // Détails du paiement
    paymentMethod: '',
    paymentStatus: 'pending',
    paymentDate: '',
    dueDate: '',
    recurringPayment: false,
    frequency: 'none',
    
    // Informations de contact
    contactType: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    
    // Détails supplémentaires
    reference: '',
    description: '',
    tags: [],
    attachments: [],
    notes: '',
    
    // Informations comptables
    accountingCode: '',
    taxRate: '0',
    taxAmount: '0',
    budgetCategory: '',
    projectCode: '',
    departmentCode: '',
    
    // Informations bancaires
    bankAccount: '',
    bankReference: '',
    checkNumber: '',
    
    // Informations de suivi
    createdBy: '',
    approvedBy: '',
    status: 'draft'
  });

  const mainCategories = {
    income: [
      { value: 'sales', label: 'Ventes' },
      { value: 'services', label: 'Services' },
      { value: 'consulting', label: 'Consulting' },
      { value: 'rental', label: 'Location' },
      { value: 'investment', label: 'Investissements' },
      { value: 'other_income', label: 'Autres revenus' }
    ],
    expense: [
      { value: 'purchases', label: 'Achats' },
      { value: 'salary', label: 'Salaires' },
      { value: 'services', label: 'Services' },
      { value: 'rent', label: 'Loyer' },
      { value: 'utilities', label: 'Charges' },
      { value: 'equipment', label: 'Équipement' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'travel', label: 'Déplacements' },
      { value: 'other_expense', label: 'Autres dépenses' }
    ]
  };

  const subCategories = {
    sales: ['Produits finis', 'Matières premières', 'Services', 'Autres ventes'],
    services: ['Consultation', 'Installation', 'Maintenance', 'Formation'],
    consulting: ['Technique', 'Management', 'Financier', 'Stratégique'],
    rental: ['Équipement', 'Véhicules', 'Locaux', 'Autres'],
    investment: ['Intérêts', 'Dividendes', 'Plus-values', 'Autres'],
    other_income: ['Subventions', 'Remboursements', 'Divers'],
    
    purchases: ['Matières premières', 'Fournitures', 'Équipement', 'Stock'],
    salary: ['Salaires fixes', 'Primes', 'Charges sociales', 'Avantages'],
    rent: ['Bureau', 'Entrepôt', 'Parking', 'Autres'],
    utilities: ['Électricité', 'Eau', 'Gaz', 'Internet', 'Téléphone'],
    equipment: ['Machines', 'Véhicules', 'Informatique', 'Mobilier'],
    maintenance: ['Bâtiments', 'Équipement', 'Véhicules', 'Autres'],
    marketing: ['Publicité', 'Events', 'Communication', 'Digital'],
    travel: ['Transport', 'Hébergement', 'Repas', 'Autres'],
    other_expense: ['Assurances', 'Taxes', 'Frais bancaires', 'Divers']
  };

  const paymentMethods = [
    { value: 'cash', label: 'Espèces' },
    { value: 'bank_transfer', label: 'Virement bancaire' },
    { value: 'credit_card', label: 'Carte bancaire' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'check', label: 'Chèque' },
    { value: 'direct_debit', label: 'Prélèvement' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'crypto', label: 'Cryptomonnaie' }
  ];

  const frequencies = [
    { value: 'none', label: 'Aucune' },
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' },
    { value: 'quarterly', label: 'Trimestriel' },
    { value: 'yearly', label: 'Annuel' }
  ];

  const contactTypes = [
    { value: 'customer', label: 'Client' },
    { value: 'supplier', label: 'Fournisseur' },
    { value: 'employee', label: 'Employé' },
    { value: 'contractor', label: 'Prestataire' },
    { value: 'other', label: 'Autre' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Calcul automatique de la TVA
      if (field === 'amount' || field === 'taxRate') {
        const amount = parseFloat(newData.amount) || 0;
        const taxRate = parseFloat(newData.taxRate) || 0;
        newData.taxAmount = ((amount * taxRate) / 100).toFixed(2);
      }
      
      return newData;
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Informations de base
        return formData.type && formData.mainCategory && formData.amount;
      case 2: // Détails du paiement
        return formData.paymentMethod && formData.paymentDate;
      case 3: // Informations de contact
        return formData.contactType && formData.contactName;
      case 4: // Informations comptables
        return true; // Champs optionnels
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de transaction
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                <option value="income">Entrée</option>
                <option value="expense">Sortie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie principale
              </label>
              <select
                value={formData.mainCategory}
                onChange={(e) => handleInputChange('mainCategory', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                <option value="">Sélectionner une catégorie</option>
                {mainCategories[formData.type].map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {formData.mainCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sous-catégorie
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                  className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                >
                  <option value="">Sélectionner une sous-catégorie</option>
                  {subCategories[formData.mainCategory]?.map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Montant
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50 pl-3 pr-12"
                  placeholder="0.00"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-pro-lime focus:ring-pro-lime"
                  >
                    <option value="XOF">Franc CFA</option>
                    <option value="EUR">Euro EU</option>
                    <option value="USD">Dollard USD</option>
                    <option value="GBP">Livre Sterling GBP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Méthode de paiement
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                <option value="">Sélectionner une méthode</option>
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de paiement
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date d'échéance
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="recurringPayment"
                checked={formData.recurringPayment}
                onChange={(e) => handleInputChange('recurringPayment', e.target.checked)}
                className="rounded border-gray-300 text-pro-lime focus:ring-pro-lime"
              />
              <label htmlFor="recurringPayment" className="text-sm text-gray-700 dark:text-gray-300">
                Paiement récurrent
              </label>
            </div>

            {formData.recurringPayment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fréquence
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de contact
              </label>
              <select
                value={formData.contactType}
                onChange={(e) => handleInputChange('contactType', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                <option value="">Sélectionner un type</option>
                {contactTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du contact
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Nom complet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="+XX XXX XXX XXX"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code comptable
              </label>
              <input
                type="text"
                value={formData.accountingCode}
                onChange={(e) => handleInputChange('accountingCode', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: AC-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Taux de TVA (%)
              </label>
              <input
                type="number"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Montant TVA
              </label>
              <input
                type="number"
                value={formData.taxAmount}
                readOnly
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                rows={4}
                placeholder="Description détaillée..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes internes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="block w-full rounded-lg border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                rows={2}
                placeholder="Notes internes..."
              />
            </div>
          </div>
        );
    }
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      totalAmount: parseFloat(formData.amount) + parseFloat(formData.taxAmount)
    };
    onSubmit(finalData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-auto">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentStep === 1 && "Informations de base"}
                {currentStep === 2 && "Détails du paiement"}
                {currentStep === 3 && "Informations de contact"}
                {currentStep === 4 && "Informations comptables"}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {renderStep()}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className={`btn btn-secondary p-1 rounded-xl hover:p-2 flex items-center space-x-2 ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              <ArrowSmallLeftIcon className="w-5 h-5" />
              <span>Précédent</span>
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStepValid()}
                className="btn btn-primary p-1 rounded-xl hover:p-2 flex items-center space-x-2"
              >
                <span>Suivant</span>
                <ArrowSmallRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="btn btn-primary p-1 rounded-xl hover:p-2 flex items-center space-x-2"
              >
                <CheckIcon className="w-5 h-5 hover:animate-spin" />
                <span>Terminer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}