import React, { useState, useEffect } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2563eb',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableHeader: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
  },
  tableCell: {
    padding: 5,
    flex: 1,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
  deliveryInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f3f4f6',
  }
});

const PurchaseOrderDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>BON DE COMMANDE</Text>
          <Text>N° {data.orderNumber}</Text>
          <Text>Date: {data.date}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold' }}>Fournisseur:</Text>
        {data.supplier && (
          <>
            <Text>{data.supplier.name || 'N/A'}</Text>
            <Text>{data.supplier.address || 'N/A'}</Text>
            <Text>SIRET: {data.supplier.siret || 'N/A'}</Text>
            <Text>Contact: {data.supplier.phone || 'N/A'}</Text>
          </>
        )}
      </View>

      <View style={styles.deliveryInfo}>
        <Text style={{ fontWeight: 'bold' }}>Informations de livraison:</Text>
        <Text>Date souhaitée: {data.deliveryDate || 'À définir'}</Text>
        <Text>Adresse: {data.deliveryAddress || 'À définir'}</Text>
        <Text>Contact: {data.deliveryContact || 'À définir'}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Référence</Text>
          <Text style={styles.tableCell}>Description</Text>
          <Text style={styles.tableCell}>Quantité</Text>
          <Text style={styles.tableCell}>Prix unitaire</Text>
          <Text style={styles.tableCell}>Total HT</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.reference || 'N/A'}</Text>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{item.unitPrice}€</Text>
            <Text style={styles.tableCell}>{(item.quantity * item.unitPrice).toFixed(2)}€</Text>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <Text>Total HT: {data.totalHT.toFixed(2)}€</Text>
        <Text>TVA ({data.tvaRate}%): {data.tvaAmount.toFixed(2)}€</Text>
        <Text>Total TTC: {data.totalTTC.toFixed(2)}€</Text>
      </View>

      <View style={styles.footer}>
        <Text>Bon de commande généré le {data.date}</Text>
        <Text>Conditions de paiement: {data.paymentTerms}</Text>
      </View>
    </Page>
  </Document>
);

export default function SupplierPurchaseOrder({ supplier, isOpen, onClose }) {
  const [orderData, setOrderData] = useState({
    orderNumber: '',
    date: '',
    supplier: null,
    deliveryDate: '',
    deliveryAddress: '',
    deliveryContact: '',
    items: [],
    totalHT: 0,
    tvaRate: 20,
    tvaAmount: 0,
    totalTTC: 0,
    paymentTerms: '30 jours'
  });

  const [newItem, setNewItem] = useState({
    reference: '',
    description: '',
    quantity: 1,
    unitPrice: 0
  });

  useEffect(() => {
    if (supplier) {
      setOrderData(prev => ({
        ...prev,
        orderNumber: `BC-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        supplier: supplier,
      }));
    }
  }, [supplier]);

  const addItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      alert('Veuillez remplir tous les champs correctement');
      return;
    }

    const updatedItems = [...orderData.items, newItem];
    const totalHT = updatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tvaAmount = totalHT * (orderData.tvaRate / 100);
    
    setOrderData(prev => ({
      ...prev,
      items: updatedItems,
      totalHT,
      tvaAmount,
      totalTTC: totalHT + tvaAmount
    }));
    
    setNewItem({
      reference: '',
      description: '',
      quantity: 1,
      unitPrice: 0
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>Créer un bon de commande</span>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Title>

                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de livraison souhaitée
                      </label>
                      <input
                        type="date"
                        value={orderData.deliveryDate}
                        onChange={(e) => setOrderData({ ...orderData, deliveryDate: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse de livraison
                      </label>
                      <input
                        type="text"
                        value={orderData.deliveryAddress}
                        onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Adresse de livraison"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Référence"
                        value={newItem.reference}
                        onChange={(e) => setNewItem({ ...newItem, reference: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value) || 0) })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Prix unitaire"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({ ...newItem, unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <button
                    onClick={addItem}
                    className="w-full sm:w-auto mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Ajouter un article
                  </button>

                  <div className="mt-4 border rounded">
                    {orderData.items.length > 0 ? (
                      <div className="h-[500px]">
                        <PDFViewer width="100%" height="100%">
                          <PurchaseOrderDocument data={orderData} />
                        </PDFViewer>
                      </div>
                    ) : (
                      <div className="h-[500px] flex items-center justify-center text-gray-500">
                        Ajoutez des articles pour voir l'aperçu du bon de commande
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        console.log('Bon de commande sauvegardé:', orderData);
                        onClose();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      disabled={orderData.items.length === 0}
                    >
                      Finaliser le bon de commande
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
