 import { useState } from 'react';
 import {
   XMarkIcon,
   PencilSquareIcon,
   TrashIcon,
 } from '@heroicons/react/24/outline';
 
 import ProjectModalTabs from './ProjectModalTabs'; 
 import ProjectModalOverview from './ProjectModalOverview'; 
 import ProjectModalTasks from './ProjectModalTasks'; 
 import ProjectModalTeam from './ProjectModalTeam';  
 import ProjectModalDocuments from './ProjectModalDocuments'; 
 import ProjectModalBudget from './ProjectModalBudget';  
import ProjectModalEquipment from './ProjectModalEquipment';
 
 export default function ProjectModal({ project: initialProject, onClose, onUpdate, onDelete, isNew = false }) {
   const [activeTab, setActiveTab] = useState('overview');
   const [isEditing, setIsEditing] = useState(isNew);
   const [project, setProject] = useState(initialProject);
 
   const handleSave = () => {
     onUpdate(project);
     setIsEditing(false);
   };
 
   const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectModalOverview project={project} isEditing={isEditing} onProjectChange={setProject} />;
      case 'tasks':
        return <ProjectModalTasks project={project} isEditing={isEditing} onProjectChange={setProject} />;
      case 'team':
        return <ProjectModalTeam project={project} isEditing={isEditing} onProjectChange={setProject} />;
      case 'documents':
        return <ProjectModalDocuments project={project} isEditing={isEditing} onProjectChange={setProject} />;
      case 'budget':
        return <ProjectModalBudget project={project} isEditing={isEditing} onProjectChange={setProject} />;
      case 'equipment':
        return <ProjectModalEquipment project={project} isEditing={isEditing} onProjectChange={setProject} />;
      default:
        return null;
    }
  };
 
   return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
       <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
         {/* Header */}
         <div className="p-6 border-b border-gray-200 dark:border-gray-800">
           <div className="flex justify-between items-start">
             <div>
               {isEditing ? (
                 <input
                   type="text"
                   value={project.name}
                   onChange={(e) => setProject({ ...project, name: e.target.value })}
                   className="text-2xl font-bold bg-transparent border-b-2 border-pro-lime focus:outline-none text-gray-900 dark:text-white"
                   placeholder="Nom du projet"
                 />
               ) : (
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
               )}
               <p className="mt-1 text-gray-500 dark:text-gray-400">
                 {isEditing ? (
                   <input
                     type="text"
                     value={project.manager}
                     onChange={(e) => setProject({ ...project, manager: e.target.value })}
                     className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-pro-lime"
                     placeholder="Responsable du projet"
                   />
                 ) : (
                   `Géré par ${project.manager}`
                 )}
               </p>
             </div>
             <div className="flex items-center space-x-4">
               {!isEditing ? (
                 <>
                   <button
                     onClick={() => setIsEditing(true)}
                     className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                   >
                     <PencilSquareIcon className="w-5 h-5" />
                   </button>
                   <button
                     onClick={onDelete}
                     className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                   >
                     <TrashIcon className="w-5 h-5" />
                   </button>
                 </>
               ) : (
                 <button
                   onClick={handleSave}
                   className="px-4 py-2 bg-pro-lime text-black rounded-lg hover:bg-pro-lime/90"
                 >
                   Enregistrer
                 </button>
               )}
               <button
                 onClick={onClose}
                 className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
               >
                 <XMarkIcon className="w-6 h-6" />
               </button>
             </div>
           </div>
 
           <ProjectModalTabs activeTab={activeTab} onTabChange={setActiveTab} />
         </div>
 
         {/* Content */}
         <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
           {renderContent()}
         </div>
       </div>
     </div>
   );
 }