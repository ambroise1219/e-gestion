'use client';

import { useState } from 'react';
import { 
  FolderIcon, 
  DocumentIcon, 
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentModalAdd from './DocumentModalAdd';
import DocumentCard from './DocumentCard';
import DocumentModal from './DocumentModal';

export default function Documents() {
  const [documents] = useState([
    { 
      id: 1, 
      name: 'Plan_Chantier_A.pdf', 
      type: 'PDF', 
      size: '2.5 MB', 
      date: '2023-12-05', 
      category: 'Plans',
      status: 'Validé'
    },
    { 
      id: 2, 
      name: 'Contrat_Client_123.docx', 
      type: 'DOCX', 
      size: '1.2 MB', 
      date: '2023-12-04', 
      category: 'Contrats',
      status: 'En attente'
    },
    { 
      id: 3, 
      name: 'Devis_Project_456.xlsx', 
      type: 'XLSX', 
      size: '0.8 MB', 
      date: '2023-12-03', 
      category: 'Devis',
      status: 'En cours'
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'Tous', icon: FolderIcon, count: documents.length },
    { id: 'plans', name: 'Plans', icon: DocumentIcon, count: documents.filter(d => d.category === 'Plans').length },
    { id: 'contracts', name: 'Contrats', icon: DocumentIcon, count: documents.filter(d => d.category === 'Contrats').length },
    { id: 'quotes', name: 'Devis', icon: DocumentIcon, count: documents.filter(d => d.category === 'Devis').length },
  ];

  const handleUpload = () => {
    setIsAddModalOpen(true);
  };

  const handleDownload = (doc) => {
    // Implémenter la logique de téléchargement
  };

  const handleDelete = (doc) => {
    // Implémenter la logique de suppression
  };

  const handleView = (doc) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const handleDocumentChange = (updatedDocument) => {
    // Implémenter la logique de mise à jour
    console.log('Document mis à jour:', updatedDocument);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'Tous' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <DocumentModalAdd 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={selectedDocument}
        onDocumentChange={handleDocumentChange}
      />

      {/* En-tête avec recherche et actions */}
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

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white dark:bg-pro-black rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-pro-lime text-pro-black'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-pro-lime text-pro-black'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleUpload}
            className="flex items-center px-4 py-2 bg-pro-lime text-pro-black rounded-lg hover:bg-pro-lime-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pro-lime"
          >
            <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
            <span>Ajouter un document</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar des catégories */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-pro-black rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Catégories</h2>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-pro-lime text-pro-black'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-pro-black-light'
                  }`}
                >
                  <div className="flex items-center">
                    <category.icon className="h-5 w-5 mr-2" />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-sm">{category.count}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onClick={() => handleView(doc)}
                    onDownload={() => handleDownload(doc)}
                    onDelete={() => handleDelete(doc)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-pro-black rounded-lg shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-pro-black-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Taille</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-pro-black divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-pro-black-light">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DocumentIcon className="h-5 w-5 mr-2 text-gray-400" />
                              <span className="text-gray-900 dark:text-white">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{doc.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{doc.size}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{doc.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              doc.status === 'Validé' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              doc.status === 'En cours' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleView(doc)}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDownload(doc)}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                              >
                                <DocumentArrowDownIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(doc)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}