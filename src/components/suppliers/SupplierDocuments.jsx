import React, { useState } from 'react';
import { 
  DocumentIcon, 
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  FolderIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const SupplierDocuments = ({ supplier }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');

  // Exemple de données pour les dossiers
  const folders = [
    { id: 'all', name: 'Tous les documents', count: 12 },
    { id: 'contracts', name: 'Contrats', count: 3 },
    { id: 'invoices', name: 'Factures', count: 5 },
    { id: 'certifications', name: 'Certifications', count: 2 },
    { id: 'legal', name: 'Documents légaux', count: 2 },
  ];

  // Exemple de données pour les documents
  const documents = [
    {
      id: 1,
      name: 'Contrat de partenariat 2024',
      type: 'PDF',
      size: '2.4 MB',
      folder: 'contracts',
      date: '2024-01-15',
      status: 'valid'
    },
    {
      id: 2,
      name: 'Certification ISO 9001',
      type: 'PDF',
      size: '1.8 MB',
      folder: 'certifications',
      date: '2023-12-01',
      status: 'valid'
    },
    {
      id: 3,
      name: 'Facture #2024-001',
      type: 'PDF',
      size: '856 KB',
      folder: 'invoices',
      date: '2024-01-10',
      status: 'valid'
    },
    // Ajoutez plus de documents ici
  ];

  const handleUpload = () => {
    // Implémenter la logique d'upload
  };

  const handleDownload = (document) => {
    // Implémenter la logique de téléchargement
  };

  const handleDelete = (document) => {
    // Implémenter la logique de suppression
  };

  const handleView = (document) => {
    // Implémenter la logique de visualisation
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
    const matchesType = filterType === 'all' || doc.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFolder && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-pro-black text-gray-900 dark:text-white focus:ring-2 focus:ring-pro-lime focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleUpload}
            className="flex items-center px-4 py-2 bg-pro-lime text-pro-black rounded-lg hover:bg-pro-lime-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pro-lime"
          >
            <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
            <span>Ajouter un document</span>
          </button>
        </div>
      </div>

      {/* Filtres et dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau latéral */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-pro-black rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dossiers</h3>
            <nav className="space-y-2">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-pro-lime text-pro-black'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-pro-black-light'
                  }`}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-5 w-5 mr-2" />
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-sm">{folder.count}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white dark:bg-pro-black rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Type de fichier</h3>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-pro-black text-gray-900 dark:text-white focus:ring-2 focus:ring-pro-lime focus:border-transparent p-2"
            >
              <option value="all">Tous les types</option>
              <option value="pdf">PDF</option>
              <option value="doc">Word</option>
              <option value="xls">Excel</option>
              <option value="img">Image</option>
            </select>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-pro-black rounded-lg shadow-sm">
            <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-pro-black-light transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-pro-lime dark:bg-pro-lime-dark">
                        <DocumentIcon className="h-6 w-6 text-pro-black dark:text-pro-black" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                        <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(doc)}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDocuments;
