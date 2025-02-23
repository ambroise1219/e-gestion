'use client';

import { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import Finances from '@/components/finances/Finances';
import Planning from '@/components/planning/Planning';
import Stock from '@/components/stock/Stock';
import Projects from '@/components/projects/Projects';
import Employees from '@/components/employees/Employees';
import Suppliers from '@/components/suppliers/Suppliers';
import Security from '@/components/security/Security';
import Documents from '@/components/documents/Documents';
import Settings from '@/components/settings/Settings';
import Finance from '@/components/finances/Finances';

export default function HomePage() {
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigation = (path) => {
    setCurrentPath(path);
  };

  const renderSection = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard />;
      case '/employes':
        return <Employees />;
      case '/projets':
        return <Projects />;
      case '/stock':
        return <Stock />;
      case '/finances':
        return <Finances />;
      case '/planning':
        return <Planning />;
      case '/fournisseurs':
        return <Suppliers />;
      case '/securite':
        return <Security />;
      case '/documents':
        return <Documents />;
      case '/parametres':
        return <Settings />;
      case '/finance':
        return <Finance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-700 ">
      <Sidebar onNavigate={handleNavigation} currentPath={currentPath} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
