'use client';

import { useState, useEffect } from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Add debug logging
  useEffect(() => {
    console.log('Current user data:', user);
  }, [user]);

  const [notifications] = useState([
    { id: 1, message: 'Nouvelle demande de congés', time: 'Il y a 5 min' },
    { id: 2, message: 'Mise à jour du projet A', time: 'Il y a 30 min' },
    { id: 3, message: 'Stock faible en ciment', time: 'Il y a 1 heure' },
  ]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la déconnexion');
      }

      // Déconnexion réussie, appliquer les changements locaux
      await logout();
      router.push('/auth');
      
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // Add null check for user data
  const displayName = user ? `${user.firstname} ${user.lastname}` : 'Utilisateur';

  return (
    <>
      <header className="bg-white dark:bg-pro-black-light border-b border-gray-200 py-9 dark:border-pro-lime/20 h-16">
        <div className="h-full px-2 sm:px-4 flex items-center justify-between">
          {/* Barre de recherche desktop */}
          <div className="hidden sm:flex flex-1 max-w-2xl ml-0 sm:ml-4">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-pro-white-off/50" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg input bg-gray-50 dark:bg-pro-black-dark border-gray-200 dark:border-pro-black-dark focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            {/* Bouton recherche mobile */}
            <button 
              onClick={() => setShowMobileSearch(true)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-pro-black-dark text-gray-600 dark:text-pro-white-off transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Thème */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-pro-black-dark text-gray-600 dark:text-pro-white-off transition-colors"
                aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-pro-black-dark text-gray-600 dark:text-pro-white-off transition-colors relative"
                >
                  <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pro-lime"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-sm bg-white dark:bg-pro-black-light border border-gray-200 dark:border-pro-black-dark rounded-lg shadow-lg animate-fade-in z-50">
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <button className="text-xs text-gray-500 dark:text-pro-white-off/70 hover:text-gray-700 dark:hover:text-pro-white-off">
                          Tout marquer comme lu
                        </button>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-pro-black rounded-lg transition-colors cursor-pointer"
                          >
                            <p className="text-sm text-gray-600 dark:text-pro-white-off">{notif.message}</p>
                            <span className="text-xs text-gray-400 dark:text-pro-white-off/60">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profil */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-pro-black-dark transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-pro-white-off" />
                  <span className="hidden sm:inline text-sm text-gray-700 dark:text-pro-white-off">{displayName}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-pro-black-light border border-gray-200 dark:border-pro-black-dark rounded-lg shadow-lg animate-fade-in z-50">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-100 dark:border-pro-black-dark">
                        <div className="relative">
                          {user?.profile_picture_url ? (
                            <img 
                              src={user.profile_picture_url} 
                              alt={displayName} 
                              className="h-12 w-12 rounded-full"
                            />
                          ) : (
                            <UserCircleIcon className="h-12 w-12 text-gray-400 dark:text-pro-white-off/70" />
                          )}
                          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-pro-black-light ${user?.is_active ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                          <p className="text-xs text-gray-500 dark:text-pro-white-off/70">{user?.email}</p>
                          <p className="text-xs text-gray-500 dark:text-pro-white-off/70">{user?.position || user?.role}</p>
                        </div>
                      </div>

                      <div className="space-y-1 mb-3 pb-3 border-b border-gray-100 dark:border-pro-black-dark">
                        <div className="text-xs text-gray-500 dark:text-pro-white-off/70">
                          <span>Département: </span>
                          <span className="text-gray-700 dark:text-white">{user?.department || 'Non défini'}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-pro-white-off/70">
                          <span>Status: </span>
                          <span className="text-gray-700 dark:text-white">{user?.status || 'Actif'}</span>
                        </div>
                        {user?.hire_date && (
                          <div className="text-xs text-gray-500 dark:text-pro-white-off/70">
                            <span>Date d'embauche: </span>
                            <span className="text-gray-700 dark:text-white">
                              {new Date(user.hire_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-pro-black rounded-lg transition-colors text-gray-700 dark:text-pro-white-off">
                          <UserCircleIcon className="h-5 w-5" />
                          <span className="text-sm">Mon profil</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-pro-black rounded-lg transition-colors text-gray-700 dark:text-pro-white-off">
                          <Cog6ToothIcon className="h-5 w-5" />
                          <span className="text-sm">Paramètres</span>
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-pro-black rounded-lg transition-colors text-red-500"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span className="text-sm">Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Barre de recherche mobile */}
      {showMobileSearch && (
        <div className="sm:hidden fixed top-0 left-0 right-0 bg-white/95 dark:bg-pro-black-light/95 backdrop-blur-sm z-50 animate-slide-down">
          <div className="h-16 px-2 flex items-center space-x-2 border-b border-gray-200 dark:border-pro-lime/20 shadow-lg">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-pro-white-off/50" />
              <input
                type="text"
                placeholder="Rechercher..."
                autoFocus
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg input bg-gray-50 dark:bg-pro-black-dark border-gray-200 dark:border-pro-black-dark focus:ring-2 focus:ring-[#CCFF00] dark:focus:ring-pro-lime focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-pro-black-dark text-gray-600 dark:text-pro-white-off transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Résultats de recherche */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-pro-white-off/70 uppercase mb-2">Résultats récents</div>
              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-pro-black-dark text-left">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-pro-black-dark rounded-lg flex items-center justify-center">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-500 dark:text-pro-white-off/70" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">Projet Construction A</div>
                    <div className="text-xs text-gray-500 dark:text-pro-white-off/70">Projets</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-pro-black-dark text-left">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-pro-black-dark rounded-lg flex items-center justify-center">
                    <UserCircleIcon className="h-4 w-4 text-gray-500 dark:text-pro-white-off/70" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">Jean Dupont</div>
                    <div className="text-xs text-gray-500 dark:text-pro-white-off/70">Employé</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}