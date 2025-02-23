'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, DocumentIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function EmployeeModals({
  selectedEmployee,
  editingEmployee,
  showNewEmployeeModal,
  showDeleteConfirm,
  showDocumentModal,
  onClose,
  onEditSubmit,
  onCreateSubmit,
  onDeleteConfirm,
  onDocumentView
}) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    department: '',
    position: '',
    role: '',
    hire_date: new Date().toISOString().split('T')[0],
    password: '' // Ajout du champ password
  });

  // Initialiser le formulaire avec les données de l'employé en cours de modification
  useEffect(() => {
    if (editingEmployee) {
      const [firstname, lastname] = editingEmployee.name.split(' ');
      setFormData({
        firstname,
        lastname,
        email: editingEmployee.email,
        phone_number: editingEmployee.phone,
        department: editingEmployee.department,
        position: editingEmployee.position,
        role: editingEmployee.role,
        hire_date: editingEmployee.startDate.split('T')[0]
      });
    }
  }, [editingEmployee]);

  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname || !formData.email || 
        !formData.department || !formData.position || !formData.role || 
        !formData.hire_date) {
      setFormError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Format d\'email invalide');
      return false;
    }
    // Validation mot de passe uniquement si un nouveau mot de passe est fourni
    if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      await onCreateSubmit(e, formData);
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone_number: '',
        department: '',
        position: '',
        role: '',
        hire_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      setFormError(error.message || 'Une erreur est survenue');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      // Créer un objet avec toutes les données existantes de l'employé
      const updatedEmployeeData = {
        ...selectedEmployee,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone_number: formData.phone_number,
        department: formData.department,
        position: formData.position,
        role: formData.role,
        hire_date: formData.hire_date,
        password: formData.password || undefined // Inclure le mot de passe uniquement s'il est fourni
      };

      await onEditSubmit(editingEmployee.id, updatedEmployeeData);
      
      // Mettre à jour les données affichées dans le modal des détails
      if (selectedEmployee) {
        setSelectedEmployee({
          ...selectedEmployee,
          name: `${formData.firstname} ${formData.lastname}`,
          email: formData.email,
          phone: formData.phone_number,
          department: formData.department,
          position: formData.position,
          role: formData.role,
          startDate: formData.hire_date
        });
      }

      onClose('edit');
    } catch (error) {
      setFormError(error.message || 'Une erreur est survenue lors de la modification');
    }
  };

  return (
    <>
      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-pro-black-light rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header with Avatar */}
            <div className="sticky top-0 bg-white dark:bg-pro-black-light border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-[#CCFF00] dark:bg-pro-lime flex items-center justify-center">
                    {selectedEmployee.avatar ? (
                      <img 
                        src={selectedEmployee.avatar} 
                        alt={selectedEmployee.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-semibold text-black">
                        {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedEmployee.name}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {selectedEmployee.position}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onClose('details')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-8">
              {/* Status Banner */}
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                selectedEmployee.status === 'active' 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedEmployee.status === 'active' 
                      ? 'bg-green-500' 
                      : 'bg-gray-500'
                  }`} />
                  <span className={`font-medium ${
                    selectedEmployee.status === 'active'
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-400'
                  }`}>
                    {selectedEmployee.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Date d'embauche: {new Date(selectedEmployee.startDate).toLocaleDateString()}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jours de congés</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.vacation_days || 0}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ancienneté</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {Math.floor((new Date() - new Date(selectedEmployee.startDate)) / (1000 * 60 * 60 * 24 * 365))} ans
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Projets actifs</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.projects?.length || 0}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Compétences</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.skills?.length || 0}
                  </p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Informations de contact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Téléphone</label>
                      <p className="text-gray-900 dark:text-white">{selectedEmployee.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Informations professionnelles
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Département</label>
                      <p className="text-gray-900 dark:text-white">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Rôle</label>
                      <p className="text-gray-900 dark:text-white">{selectedEmployee.role}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Position</label>
                      <p className="text-gray-900 dark:text-white">{selectedEmployee.position}</p>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                  <div className="col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      Compétences
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#CCFF00]/10 dark:bg-pro-lime/10 text-black dark:text-pro-lime rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Working Hours */}
                {selectedEmployee.working_hours && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      Horaires de travail
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(selectedEmployee.working_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{day}</span>
                          <span className="text-sm text-gray-900 dark:text-white">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address Information */}
                {selectedEmployee.address && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      Adresse
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-900 dark:text-white">{selectedEmployee.address.street}</p>
                      <p className="text-gray-900 dark:text-white">
                        {selectedEmployee.address.city}, {selectedEmployee.address.postal_code}
                      </p>
                      <p className="text-gray-900 dark:text-white">{selectedEmployee.address.country}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Social Links */}
                {selectedEmployee.social_links && Object.keys(selectedEmployee.social_links).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      Réseaux sociaux
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(selectedEmployee.social_links).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <span>{platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose('details');
                    setEditingEmployee(selectedEmployee);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/96 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-pro-black rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => onClose('delete')}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-pro-black-dark rounded-lg hover:bg-gray-200 dark:hover:bg-pro-black"
              >
                Annuler
              </button>
              <button
                onClick={onDeleteConfirm}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black/96 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-pro-black rounded-lg p-6 max-w-4xl w-full h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Visualisation du document
              </h3>
              <button
                onClick={() => onClose('document')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-pro-black-dark rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="h-full bg-gray-100 dark:bg-pro-black-dark rounded-lg">
              {/* Document viewer content */}
            </div>
          </div>
        </div>
      )}
      {/* New Employee Modal */}
      {showNewEmployeeModal && (
        <Dialog 
          open={showNewEmployeeModal} 
          onClose={() => onClose('new')}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-pro-black-light rounded-xl shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-pro-black-dark">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ajouter un employé
                </Dialog.Title>
                <button
                  onClick={() => onClose('new')}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {formError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg text-sm">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                      minLength={6}
                      placeholder="Minimum 6 caractères"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Département *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un département</option>
                      <option value="IT">IT</option>
                      <option value="RH">RH</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Poste *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Rôle *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="admin">Administrateur</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employé</option>
                      <option value="intern">Stagiaire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Date d'embauche *
                    </label>
                    <input
                      type="date"
                      name="hire_date"
                      value={formData.hire_date}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-pro-black-dark">
                  <button
                    type="button"
                    onClick={() => onClose('new')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-pro-black-dark rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-black bg-[#CCFF00] hover:bg-[#CCFF00]/90 dark:bg-pro-lime dark:hover:bg-pro-lime/90 rounded-lg transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <Dialog 
          open={Boolean(editingEmployee)} 
          onClose={() => onClose('edit')}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-pro-black-light rounded-xl shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-pro-black-dark">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  Modifier l'employé
                </Dialog.Title>
                <button
                  onClick={() => onClose('edit')}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                {formError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg text-sm">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Nouveau mot de passe (optionnel)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      placeholder="Laisser vide pour conserver l'ancien"
                      minLength={6}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Minimum 6 caractères. Laissez vide pour ne pas modifier le mot de passe.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Département *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un département</option>
                      <option value="IT">IT</option>
                      <option value="RH">RH</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Poste *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Rôle *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="admin">Administrateur</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employé</option>
                      <option value="intern">Stagiaire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Date d'embauche *
                    </label>
                    <input
                      type="date"
                      name="hire_date"
                      value={formData.hire_date}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-pro-black-dark">
                  <button
                    type="button"
                    onClick={() => onClose('edit')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-pro-black-dark rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-black bg-[#CCFF00] hover:bg-[#CCFF00]/90 dark:bg-pro-lime dark:hover:bg-pro-lime/90 rounded-lg transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </>
  );
}