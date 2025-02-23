'use client';

import { useState } from 'react';
import { ArrowSmallRightIcon, ArrowSmallLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function NewEventModal({ isOpen, onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations de base
    title: '',
    type: 'meeting',
    project: '',
    priority: 'normal',
    status: 'scheduled',
    
    // Date et heure
    start: '',
    end: '',
    isRecurring: false,
    recurrencePattern: 'none',
    recurrenceEndDate: '',
    
    // Localisation et participants
    location: '',
    locationDetails: '',
    participants: [],
    externalParticipants: [],
    notifyParticipants: true,
    
    // Détails supplémentaires
    description: '',
    agenda: '',
    attachments: [],
    requiredEquipment: [],
    
    // Suivi et organisation
    organizer: '',
    department: '',
    budget: '',
    notes: '',
    
    // Rappels et notifications
    reminders: ['30'], // minutes avant
    notificationChannels: ['email'],
    
    // Logistique
    roomSetup: '',
    catering: false,
    cateringDetails: '',
    parkingRequired: false,
    accessRequirements: ''
  });

  const eventTypes = [
    { value: 'meeting', label: 'Réunion' },
    { value: 'delivery', label: 'Livraison' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'training', label: 'Formation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'visit', label: 'Visite' },
    { value: 'other', label: 'Autre' }
  ];

  const priorities = [
    { value: 'low', label: 'Basse' },
    { value: 'normal', label: 'Normale' },
    { value: 'high', label: 'Haute' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const recurrencePatterns = [
    { value: 'none', label: 'Aucune' },
    { value: 'daily', label: 'Quotidienne' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuelle' },
    { value: 'yearly', label: 'Annuelle' }
  ];

  const reminderOptions = [
    { value: '5', label: '5 minutes avant' },
    { value: '15', label: '15 minutes avant' },
    { value: '30', label: '30 minutes avant' },
    { value: '60', label: '1 heure avant' },
    { value: '120', label: '2 heures avant' },
    { value: '1440', label: '1 jour avant' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleParticipantAdd = (participant) => {
    if (!formData.participants.includes(participant)) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
    }
  };

  const handleParticipantRemove = (participant) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== participant)
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Informations de base
        return formData.title && formData.type && formData.project;
      case 2: // Date et heure
        return formData.start && formData.end && new Date(formData.start) < new Date(formData.end);
      case 3: // Localisation et participants
        return formData.location;
      case 4: // Détails supplémentaires
        return true;
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
                Titre de l'événement
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: Réunion de chantier"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'événement
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Projet associé
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: Construction Centre Commercial"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organisateur
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => handleInputChange('organizer', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: Jean Dupont"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date et heure de début
                </label>
                <input
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => handleInputChange('start', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date et heure de fin
                </label>
                <input
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => handleInputChange('end', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                className="rounded border-gray-300 text-pro-lime focus:ring-pro-lime"
              />
              <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-300">
                Événement récurrent
              </label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type de récurrence
                  </label>
                  <select
                    value={formData.recurrencePattern}
                    onChange={(e) => handleInputChange('recurrencePattern', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                  >
                    {recurrencePatterns.map(pattern => (
                      <option key={pattern.value} value={pattern.value}>{pattern.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de fin de récurrence
                  </label>
                  <input
                    type="date"
                    value={formData.recurrenceEndDate}
                    onChange={(e) => handleInputChange('recurrenceEndDate', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rappels
              </label>
              <div className="space-y-2">
                {reminderOptions.map(option => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`reminder-${option.value}`}
                      checked={formData.reminders.includes(option.value)}
                      onChange={() => handleMultiSelect('reminders', option.value)}
                      className="rounded border-gray-300 text-pro-lime focus:ring-pro-lime"
                    />
                    <label
                      htmlFor={`reminder-${option.value}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lieu
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Ex: Salle de réunion A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Détails du lieu
              </label>
              <textarea
                value={formData.locationDetails}
                onChange={(e) => handleInputChange('locationDetails', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                rows={2}
                placeholder="Instructions d'accès, étage, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Participants internes
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.participants.map((participant, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {participant}
                    <button
                      type="button"
                      onClick={() => handleParticipantRemove(participant)}
                      className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter un participant"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleParticipantAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parkingRequired"
                    checked={formData.parkingRequired}
                    onChange={(e) => handleInputChange('parkingRequired', e.target.checked)}
                    className="rounded border-gray-300 text-pro-lime focus:ring-pro-lime"
                  />
                  <label htmlFor="parkingRequired" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Parking nécessaire
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="catering"
                    checked={formData.catering}
                    onChange={(e) => handleInputChange('catering', e.target.checked)}
                    className="rounded border-gray-300 text-pro-lime focus:ring-pro-lime"
                  />
                  <label htmlFor="catering" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Service de restauration
                  </label>
                </div>
              </div>

              {formData.catering && (
                <div>
                  <textarea
                    value={formData.cateringDetails}
                    onChange={(e) => handleInputChange('cateringDetails', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                    rows={2}
                    placeholder="Détails de la restauration (nombre de personnes, restrictions alimentaires, etc.)"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                rows={3}
                placeholder="Description détaillée de l'événement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordre du jour
              </label>
              <textarea
                value={formData.agenda}
                onChange={(e) => handleInputChange('agenda', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                rows={3}
                placeholder="Points à aborder pendant l'événement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Équipement requis
              </label>
              <input
                type="text"
                value={formData.requiredEquipment.join(', ')}
                onChange={(e) => handleInputChange('requiredEquipment', e.target.value.split(',').map(item => item.trim()))}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                placeholder="Projecteur, Tableau blanc, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pièces jointes
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-pro-lime hover:text-pro-lime/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pro-lime"
                    >
                      <span>Téléverser des fichiers</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF jusqu'à 10MB
                  </p>
                </div>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pro-lime focus:ring-pro-lime dark:focus:border-pro-lime/50 dark:focus:ring-pro-lime/50"
                rows={2}
                placeholder="Notes internes"
              />
            </div>
          </div>
        );
    }
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      createdAt: new Date().toISOString()
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
                {currentStep === 2 && "Date et heure"}
                {currentStep === 3 && "Localisation et participants"}
                {currentStep === 4 && "Détails supplémentaires"}
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