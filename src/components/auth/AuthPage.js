'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email requis';
    if (!formData.password) newErrors.password = 'Mot de passe requis';
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // TODO: Implement actual authentication logic
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-pro-black">
      <AnimatedBackground />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-pro-black-light/80 backdrop-blur-lg p-8 rounded-2xl border border-pro-lime/20">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-pro-white">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Adresse email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-pro-lime/30'} rounded-lg bg-pro-black-dark placeholder-gray-500 text-pro-white focus:outline-none focus:ring-pro-lime focus:border-pro-lime focus:z-10 sm:text-sm transition-colors duration-200`}
                  placeholder="Adresse email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-pro-lime/30'} rounded-lg bg-pro-black-dark placeholder-gray-500 text-pro-white focus:outline-none focus:ring-pro-lime focus:border-pro-lime focus:z-10 sm:text-sm transition-colors duration-200`}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirmer le mot de passe</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-pro-lime/30'} rounded-lg bg-pro-black-dark placeholder-gray-500 text-pro-white focus:outline-none focus:ring-pro-lime focus:border-pro-lime focus:z-10 sm:text-sm transition-colors duration-200`}
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-pro-black bg-pro-lime hover:bg-pro-lime-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pro-lime transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-pro-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isLogin ? 'Se connecter' : 'S\'inscrire'}
              </motion.button>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-pro-lime hover:text-pro-lime-light transition-colors duration-200"
              >
                {isLogin ? 'Créer un compte' : 'Déjà inscrit ? Se connecter'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="relative z-10 w-full py-4 px-4 sm:px-6 lg:px-8 bg-pro-black-light/80 backdrop-blur-lg border-t border-pro-lime/20">
        <div className="text-center text-xs text-pro-white-off">
          <p>&copy; 2024 BTP ERP. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}