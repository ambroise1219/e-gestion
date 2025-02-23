'use client';

export default function EmployeeStats({ employees }) {
  // Calculate statistics from employees array
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const uniqueDepartments = new Set(employees.map(emp => emp.department));
  const departments = uniqueDepartments.size;
  const avgEmployeesPerDept = departments > 0 ? Math.round(totalEmployees / departments) : 0;
  
  const employeesInProjects = employees.filter(emp => emp.projects && emp.projects.length > 0).length;
  const activeProjects = new Set(
    employees.flatMap(emp => emp.projects || [])
  ).size;

  // For demo purposes, assuming 90% attendance rate and 10% on leave
  const attendanceRate = 90;
  const employeesOnLeave = Math.round(totalEmployees * 0.1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-pro-black-card p-4 rounded-lg border border-gray-200 dark:border-pro-black-dark">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Employés</h3>
        <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{totalEmployees}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {activeEmployees} actifs
        </p>
      </div>

      <div className="bg-white dark:bg-pro-black-card p-4 rounded-lg border border-gray-200 dark:border-pro-black-dark">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Départements</h3>
        <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{departments}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {avgEmployeesPerDept} employés/dept en moyenne
        </p>
      </div>

      <div className="bg-white dark:bg-pro-black-card p-4 rounded-lg border border-gray-200 dark:border-pro-black-dark">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Projets Actifs</h3>
        <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{activeProjects}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {employeesInProjects} employés assignés
        </p>
      </div>

      <div className="bg-white dark:bg-pro-black-card p-4 rounded-lg border border-gray-200 dark:border-pro-black-dark">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux de Présence</h3>
        <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{attendanceRate}%</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {employeesOnLeave} en congé
        </p>
      </div>
    </div>
  );
}