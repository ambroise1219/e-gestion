import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import InvoiceDocument from './InvoiceDocument';
import InvoiceInformation from './invoice/InvoiceInformation';
import CompanyInformation from './invoice/CompanyInformation';
import SupplierInformation from './invoice/SupplierInformation';
import InvoiceItems from './invoice/InvoiceItems';
import PaymentInformation from './invoice/PaymentInformation';
import InvoiceNotes from './invoice/InvoiceNotes';

const sections = [
  { id: 'informations', label: 'Informations' },
  { id: 'company', label: 'Entreprise' },
  { id: 'supplier', label: 'Fournisseur' },
  { id: 'items', label: 'Articles' },
  { id: 'payment', label: 'Paiement' },
  { id: 'notes', label: 'Notes' }
];

export default function SupplierInvoice({ supplier, isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('informations');
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `FAC-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplier: {
      ...supplier,
      paymentTerms: '30 jours',
      bankDetails: {
        bankName: 'Nom de la banque',
        iban: 'FR76 XXXX XXXX XXXX XXXX',
        bic: 'XXXXXXXX'
      }
    },
    company: {
      name: 'Votre Entreprise',
      address: 'Adresse de l\'entreprise',
      city: 'Ville',
      postalCode: 'Code Postal',
      country: 'France',
      phone: 'Téléphone',
      email: 'contact@entreprise.fr',
      siret: 'N° SIRET',
      vatNumber: 'N° TVA'
    },
    items: [],
    totalHT: 0,
    tvaRate: 20,
    tvaAmount: 0,
    totalTTC: 0,
    notes: '',
    paymentInstructions: 'Paiement à réception de la facture par virement bancaire.',
    logo: '/logo.png'
  });

  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 0,
    unitPrice: 0
  });

  const updateInvoiceField = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const updateCompanyField = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value }
    }));
  };

  const updateSupplierField = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      supplier: { ...prev.supplier, [field]: value }
    }));
  };

  const updateBankDetails = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      supplier: {
        ...prev.supplier,
        bankDetails: { ...prev.supplier.bankDetails, [field]: value }
      }
    }));
  };

  const addItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.unitPrice <= 0) return;

    const updatedItems = [...invoiceData.items, newItem];
    const totalHT = updatedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tvaAmount = totalHT * (invoiceData.tvaRate / 100);

    setInvoiceData(prev => ({
      ...prev,
      items: updatedItems,
      totalHT,
      tvaAmount,
      totalTTC: totalHT + tvaAmount
    }));

    setNewItem({
      description: '',
      quantity: 0,
      unitPrice: 0
    });
  };

  const removeItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    const totalHT = updatedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tvaAmount = totalHT * (invoiceData.tvaRate / 100);

    setInvoiceData(prev => ({
      ...prev,
      items: updatedItems,
      totalHT,
      tvaAmount,
      totalTTC: totalHT + tvaAmount
    }));
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'informations':
        return <InvoiceInformation invoiceData={invoiceData} updateInvoiceField={updateInvoiceField} />;
      case 'company':
        return <CompanyInformation company={invoiceData.company} updateCompanyField={updateCompanyField} />;
      case 'supplier':
        return (
          <SupplierInformation
            supplier={invoiceData.supplier}
            updateSupplierField={updateSupplierField}
            updateBankDetails={updateBankDetails}
          />
        );
      case 'items':
        return (
          <InvoiceItems
            items={invoiceData.items}
            newItem={newItem}
            setNewItem={setNewItem}
            addItem={addItem}
            removeItem={removeItem}
          />
        );
      case 'payment':
        return <PaymentInformation invoiceData={invoiceData} updateInvoiceField={updateInvoiceField} />;
      case 'notes':
        return <InvoiceNotes notes={invoiceData.notes} updateInvoiceField={updateInvoiceField} />;
      default:
        return null;
    }
  };

  const handleDownload = async () => {
    const blob = await pdf(<InvoiceDocument data={invoiceData} />).toBlob();
    saveAs(blob, `facture-${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-7xl h-[90vh] bg-white dark:bg-pro-black rounded-xl shadow-xl flex flex-col">
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 rounded-lg bg-pro-lime dark:bg-pro-lime-dark">
                <DocumentIcon className="w-5 h-5 sm:w-6 sm:h-6 text-pro-black dark:text-pro-black" />
              </div>
              <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Créer une facture
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 min-h-0">
            <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
                <nav className="p-2 sm:p-4 flex lg:block space-x-2 lg:space-x-0 lg:space-y-2">
                  {sections.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className={`
                        min-w-[120px] lg:w-full text-left px-3 py-2 rounded-lg transition-colors
                        ${activeSection === id
                          ? 'bg-pro-lime text-black'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-16rem)] lg:max-h-[calc(90vh-12rem)]">
                {renderActiveSection()}
              </div>
            </div>

            <div className="flex-1 p-4 min-h-[400px] lg:min-h-0">
              <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                <PDFViewer width="100%" height="100%">
                  <InvoiceDocument data={invoiceData} />
                </PDFViewer>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-2 sm:gap-4 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-pro-lime hover:bg-pro-lime/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pro-lime"
            >
              Télécharger
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
