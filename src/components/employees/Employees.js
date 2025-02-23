'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import EmployeeList from './EmployeeList';
import EmployeeStats from './EmployeeStats';
import EmployeeFilters from './EmployeeFilters';
import EmployeeModals from './EmployeeModals';
import EmployeeHeader from './EmployeeHeader';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [newDocument, setNewDocument] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        const formattedEmployees = data.map(emp => ({
          id: emp.id,
          name: `${emp.firstname} ${emp.lastname}`,
          role: emp.role || 'N/A',
          email: emp.email,
          phone: emp.phone_number || 'N/A',
          department: emp.department || 'N/A',
          startDate: emp.hire_date || new Date().toISOString(),
          status: emp.status || 'active',
          position: emp.position || 'N/A',
          projects: emp.projects || [],
          avatar: emp.profile_picture_url
        }));
        setEmployees(formattedEmployees);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search and department
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Handle employee deletion
  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`/api/employees?id=${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      setEmployees(employees.filter(emp => emp.id !== employeeId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdateEmployee = async (employeeId, formData) => {
    try {
      // Préparer les données pour l'envoi
      const updateData = {
        id: employeeId,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone_number: formData.phone_number,
        department: formData.department,
        position: formData.position,
        role: formData.role,
        hire_date: formData.hire_date
      };

      // N'inclure le mot de passe que s'il est fourni
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/employees`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update employee');
      }

      // Mettre à jour la liste des employés
      const updatedEmployee = {
        id: employeeId,
        name: `${formData.firstname} ${formData.lastname}`,
        email: formData.email,
        phone: formData.phone_number || 'N/A',
        department: formData.department,
        position: formData.position,
        role: formData.role,
        startDate: formData.hire_date,
        status: 'active'
      };

      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.id === employeeId ? { ...emp, ...updatedEmployee } : emp
        )
      );

      setEditingEmployee(null);
      setError(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  };

  const handleCreateEmployee = async (e, formData) => {
    e.preventDefault();
    try {
      // Format des données avant envoi
      const employeeData = {
        firstname: formData.firstname?.trim(),
        lastname: formData.lastname?.trim(),
        email: formData.email?.trim(),
        phone_number: formData.phone_number?.trim() || null,
        department: formData.department,
        position: formData.position?.trim(),
        role: formData.role,
        hire_date: formData.hire_date,
        password: formData.password // Ajout du mot de passe
      };

      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      const newEmployee = await response.json();

      // Formater l'employé pour l'affichage
      const formattedEmployee = {
        id: newEmployee.id,
        name: `${newEmployee.firstname} ${newEmployee.lastname}`,
        role: newEmployee.role || 'N/A',
        email: newEmployee.email,
        phone: newEmployee.phone_number || 'N/A',
        department: newEmployee.department || 'N/A',
        startDate: newEmployee.hire_date,
        status: 'active',
        position: newEmployee.position || 'N/A',
        projects: []
      };

      setEmployees(prevEmployees => [...prevEmployees, formattedEmployee]);
      setShowNewEmployeeModal(false);
      setError(null);
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error; // Propager l'erreur pour qu'elle soit gérée par le formulaire
    }
  };

  // Prevent event propagation
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center h-64 flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <EmployeeHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setShowNewEmployeeModal={setShowNewEmployeeModal}
      />

      {showFilters && (
        <EmployeeFilters
          filterDepartment={filterDepartment}
          setFilterDepartment={setFilterDepartment}
          departments={Array.from(new Set(employees.map(emp => emp.department)))}
        />
      )}

      <EmployeeStats employees={employees} />

      <EmployeeList
        employees={filteredEmployees}
        viewMode={viewMode}
        onEmployeeClick={setSelectedEmployee}
        onEditClick={setEditingEmployee}
        onDeleteClick={setShowDeleteConfirm}
      />

      <EmployeeModals
        selectedEmployee={selectedEmployee}
        editingEmployee={editingEmployee}
        showNewEmployeeModal={showNewEmployeeModal}
        showDeleteConfirm={showDeleteConfirm}
        showDocumentModal={showDocumentModal}
        onClose={(type) => {
          switch(type) {
            case 'details':
              setSelectedEmployee(null);
              break;
            case 'edit':
              setEditingEmployee(null);
              break;
            case 'new':
              setShowNewEmployeeModal(false);
              break;
            case 'delete':
              setShowDeleteConfirm(null);
              break;
            case 'document':
              setShowDocumentModal(false);
              break;
            default:
              break;
          }
        }}
        onEditSubmit={handleUpdateEmployee}
        onCreateSubmit={handleCreateEmployee}
        onDeleteConfirm={handleDeleteEmployee}
        onDocumentView={setSelectedDocument}
      />
    </div>
  );
}
