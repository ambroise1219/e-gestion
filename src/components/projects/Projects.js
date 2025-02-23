'use client';

import { useState, useMemo } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  BanknotesIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Mock data (à remplacer par des appels API)
const mockProjects = [
  {
    id: 1,
    name: "Centre Commercial Plateau",
    description: "Construction d'un centre commercial de 3 étages",
    status: "En cours",
    progress: 75,
    startDate: "2023-09-15",
    endDate: "2024-03-15",
    budget: 450000000,
    spent: 320000000,
    manager: "Koffi Norbert",
    team: [
      { id: 1, name: "Marie Martin", role: "Chef de projet" },
      { id: 2, name: "Pierre Dubois", role: "Ingénieur" },
      { id: 3, name: "Sophie Bernard", role: "Technicien" }
    ],
    tasks: [
      { id: 1, name: "Fondations", status: "completed", progress: 100 },
      { id: 2, name: "Structure principale", status: "in_progress", progress: 80 },
      { id: 3, name: "Installations électriques", status: "in_progress", progress: 45 },
      { id: 4, name: "Finitions", status: "pending", progress: 0 }
    ],
    documents: [
      { type: "plan", filename: "plan-architectural.pdf", uploadDate: "2023-09-10" },
      { type: "permit", filename: "permis-construire.pdf", uploadDate: "2023-09-12" }
    ]
  },
  {
    id: 2,
    name: "Route Départementale 45",
    description: "Réfection de 5km de route",
    status: "En cours",
    progress: 30,
    startDate: "2024-01-10",
    endDate: "2024-05-20",
    budget: 280000000,
    spent: 85000000,
    manager: "Toure Salif",
    team: [
      { id: 4, name: "Adebisi George", role: "Chef de projet" },
      { id: 5, name: "Kone Hamed", role: "Ingénieur" }
    ],
    tasks: [
      { id: 1, name: "Études préliminaires", status: "completed", progress: 100 },
      { id: 2, name: "Terrassement", status: "in_progress", progress: 60 },
      { id: 3, name: "Revêtement", status: "pending", progress: 0 }
    ],
    documents: [
      { type: "study", filename: "etude-impact.pdf", uploadDate: "2023-12-15" }
    ]
  },
  {
    id: 3,
    name: "Rénovation Immeuble Cocody",
    description: "Rénovation complète d'un immeuble de 10 étages",
    status: "En cours",
    progress: 90,
    startDate: "2023-11-01",
    endDate: "2024-02-28",
    budget: 150000000,
    spent: 142000000,
    manager: "Pierre Dubois",
    team: [
      { id: 6, name: "Anne Martin", role: "Chef de projet" },
      { id: 7, name: "Paul Diallo", role: "Ingénieur" }
    ],
    tasks: [
      { id: 1, name: "Démolition", status: "completed", progress: 100 },
      { id: 2, name: "Rénovation structurelle", status: "completed", progress: 100 },
      { id: 3, name: "Peinture", status: "in_progress", progress: 70 }
    ],
    documents: [
      { type: "plan", filename: "plan-renovation.pdf", uploadDate: "2023-10-28" },
      { type: "report", filename: "rapport-structure.pdf", uploadDate: "2023-11-05" }
    ]
  }
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(mockProjects);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Statistiques globales
  const stats = useMemo(() => {
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'En cours').length,
      totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
      totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
      avgProgress: Math.round(
        projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
      ),
    };
  }, [projects]);

  // Filtrage et tri des projets
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'progress':
            comparison = a.progress - b.progress;
            break;
          case 'budget':
            comparison = a.budget - b.budget;
            break;
          case 'endDate':
            comparison = new Date(a.endDate) - new Date(b.endDate);
            break;
          default:
            comparison = 0;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [projects, searchTerm, filterStatus, sortBy, sortOrder]);

  const handleProjectUpdate = (updatedProject) => {
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
    setSelectedProject(null);
  };

  const handleProjectDelete = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setSelectedProject(null);
  };

  const handleNewProject = (newProject) => {
    setProjects([...projects, { ...newProject, id: projects.length + 1 }]);
    setShowNewProjectModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Projets Totaux</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalProjects}
              </h3>
            </div>
            <ChartBarIcon className="w-12 h-12 text-pro-lime" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {stats.activeProjects} projets actifs
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Budget Total</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatFCFA(stats.totalBudget)}
              </h3>
            </div>
            <BanknotesIcon className="w-12 h-12 text-pro-lime" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {formatFCFA(stats.totalSpent)} dépensés
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Progression Moyenne</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.avgProgress}%
              </h3>
            </div>
            <ChartBarIcon className="w-12 h-12 text-pro-lime" />
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <div
              className="bg-pro-lime h-2 rounded-full"
              style={{ width: `${stats.avgProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Équipes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {new Set(projects.flatMap(p => p.team.map(t => t.name))).size}
              </h3>
            </div>
            <UserGroupIcon className="w-12 h-12 text-pro-lime" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Sur {projects.length} projets
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un projet..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
            >
              <option value="all">Tous les statuts</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="En pause">En pause</option>
              <option value="Annulé">Annulé</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
            >
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="progress-desc">Progression (↓)</option>
              <option value="progress-asc">Progression (↑)</option>
              <option value="budget-desc">Budget (↓)</option>
              <option value="budget-asc">Budget (↑)</option>
              <option value="endDate-asc">Date de fin (↑)</option>
              <option value="endDate-desc">Date de fin (↓)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowNewProjectModal(true)}
          className="px-4 py-2 bg-pro-lime text-black rounded-lg hover:bg-pro-lime/90 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={handleProjectUpdate}
          onDelete={() => handleProjectDelete(selectedProject.id)}
        />
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <ProjectModal
          project={{
            name: '',
            description: '',
            status: 'En cours',
            progress: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            budget: 0,
            spent: 0,
            manager: '',
            team: [],
            tasks: [],
            documents: []
          }}
          onClose={() => setShowNewProjectModal(false)}
          onUpdate={handleNewProject}
          isNew={true}
        />
      )}
    </div>
  );
}
