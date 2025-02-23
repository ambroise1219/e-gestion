import { 
  DocumentIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function DocumentCard({ document, onClick, onDownload, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Validé':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'En cours':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'text-red-500';
      case 'docx':
        return 'text-blue-500';
      case 'xlsx':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg bg-pro-lime`}>
            <DocumentIcon className="h-6 w-6 text-pro-black" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-pro-lime transition-colors">
              {document.name}
            </h3>
            <div className="mt-1 flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(document.status)}`}>
                {document.status}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {document.size}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(document);
            }}
            className="icon-button text-slate-400 hover:text-pro-lime"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(document);
            }}
            className="icon-button text-red-300 hover:text-red-500"
          >
            <TrashIcon className="h-5 w-5 " />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>{document.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DocumentIcon className={`h-4 w-4 ${getFileIcon(document.type)}`} />
            <span>{document.type}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
