'use client';

export default function EmployeeFilters({ isOpen, onClose, onApply }) {
  return isOpen ? (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-pro-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-md border border-pro-white-dark dark:border-[#374151]">
        <h2 className="text-xl font-semibold mb-4 text-pro-black dark:text-white">Filtres</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pro-black-light dark:text-white/60 mb-1">
              Département
            </label>
            <select className="w-full px-4 py-2 bg-pro-white-off dark:bg-[#374151] border border-pro-white-dark dark:border-[#374151] rounded-lg text-sm text-pro-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pro-lime/50 dark:focus:ring-pro-lime/30 transition-all">
              <option value="">Tous</option>
              <option value="construction">Construction</option>
              <option value="conception">Conception</option>
              <option value="administration">Administration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-pro-black-light dark:text-white/60 mb-1">
              Statut
            </label>
            <select className="w-full px-4 py-2 bg-pro-white-off dark:bg-[#374151] border border-pro-white-dark dark:border-[#374151] rounded-lg text-sm text-pro-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pro-lime/50 dark:focus:ring-pro-lime/30 transition-all">
              <option value="">Tous</option>
              <option value="actif">Actif</option>
              <option value="conge">En congé</option>
              <option value="mission">En mission</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-pro-black-light dark:text-white/60 mb-1">
              Projet
            </label>
            <select className="w-full px-4 py-2 bg-pro-white-off dark:bg-[#374151] border border-pro-white-dark dark:border-[#374151] rounded-lg text-sm text-pro-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pro-lime/50 dark:focus:ring-pro-lime/30 transition-all">
              <option value="">Tous</option>
              <option value="renovation">Rénovation Immeuble</option>
              <option value="centre">Centre Commercial</option>
              <option value="route">Route Départementale</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-pro-white-off dark:bg-[#374151] text-pro-black dark:text-white rounded-lg border border-pro-white-dark dark:border-[#374151] hover:border-pro-lime dark:hover:border-pro-lime transition-all"
            onClick={onClose}
          >
            Annuler
          </button>
          <button 
            className="px-4 py-2 bg-pro-lime dark:bg-[#1F2937] text-pro-black dark:text-white rounded-lg border border-pro-lime dark:border-[#374151] hover:bg-pro-lime/90 dark:hover:bg-[#374151] transition-all"
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
