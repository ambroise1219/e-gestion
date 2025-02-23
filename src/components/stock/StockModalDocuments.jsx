'use client';

import { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  DocumentIcon,
  DocumentArrowUpIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function StockModalDocuments({ material, onMaterialChange, isEditing }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Liste des documents (simulée pour l'instant)
  const documents = [
    {
      id: 1,
      name: 'Facture_2024_001.pdf',
      type: 'invoice',
      size: 245760, // en bytes
      uploadDate: '2024-01-15',
      lastModified: '2024-01-15',
      status: 'valid'
    },
    {
      id: 2,
      name: 'Bon_Livraison_123.pdf',
      type: 'delivery',
      size: 189440,
      uploadDate: '2024-01-14',
      lastModified: '2024-01-14',
      status: 'valid'
    },
    {
      id: 3,
      name: 'Certificat_Qualite.pdf',
      type: 'certificate',
      size: 524288,
      uploadDate: '2024-01-13',
      lastModified: '2024-01-13',
      status: 'expired'
    },
    {
      id: 4,
      name: 'Note_Technique.docx',
      type: 'technical',
      size: 153600,
      uploadDate: '2024-01-12',
      lastModified: '2024-01-12',
      status: 'valid'
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadModal(true);
      // Simuler un upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUploadModal(false);
            setUploadProgress(0);
            setSelectedFile(null);
          }, 500);
        }
      }, 300);
    }
  };

  const handleRemoveDocument = (documentId) => {
    setShowConfirmDelete(null);
    // Logique de suppression à implémenter
    console.log(`Document ${documentId} supprimé`);
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'invoice':
        return <DocumentTextIcon className="w-8 h-8" />;
      case 'delivery':
        return <DocumentDuplicateIcon className="w-8 h-8" />;
      case 'certificate':
        return <DocumentIcon className="w-8 h-8" />;
      default:
        return <DocumentTextIcon className="w-8 h-8" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Documents</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Espace Total</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Documents Valides</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {documents.filter(doc => doc.status === 'valid').length}
          </p>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher un document..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {isEditing && (
          <div className="flex items-center">
            <label className="btn btn-primary flex items-center space-x-2 px-4 py-2 cursor-pointer">
              <DocumentArrowUpIcon className="w-5 h-5" />
              <span>Ajouter un document</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </label>
          </div>
        )}
      </div>

      {/* Liste des documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocuments.map((document) => (
          <div
            key={document.id}
            className="relative p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 ${
                document.status === 'expired' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {getDocumentIcon(document.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {document.name}
                  </h3>
                  {isEditing && (
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => setShowConfirmDelete(document.id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="mt-1 flex flex-col space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Taille: {formatFileSize(document.size)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ajouté le: {document.uploadDate}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      document.status === 'valid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {document.status === 'valid' ? 'Valide' : 'Expiré'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {document.type === 'invoice' && 'Facture'}
                      {document.type === 'delivery' && 'Bon de livraison'}
                      {document.type === 'certificate' && 'Certificat'}
                      {document.type === 'technical' && 'Document technique'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal de confirmation de suppression */}
            {showConfirmDelete === document.id && (
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center space-y-4">
                <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500" />
                <p className="text-center text-gray-900 dark:text-white">
                  Êtes-vous sûr de vouloir supprimer ce document ?
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleRemoveDocument(document.id)}
                  >
                    Confirmer
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    onClick={() => setShowConfirmDelete(null)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message si aucun document */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Aucun document
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Aucun document ne correspond à votre recherche' : 'Commencez par ajouter un document'}
          </p>
          {isEditing && !searchTerm && (
            <div className="mt-6">
              <label className="btn btn-primary flex items-center space-x-2 mx-auto cursor-pointer">
                <DocumentArrowUpIcon className="w-5 h-5" />
                <span>Ajouter un document</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </label>
            </div>
          )}
        </div>
      )}

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Upload en cours...
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowUploadModal(false)}
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {selectedFile?.name}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-pro-lime h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {uploadProgress}% terminé
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
