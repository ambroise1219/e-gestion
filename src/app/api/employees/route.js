import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET /api/employees - Get all employees
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const department = searchParams.get('department');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    let sqlQuery = `
      SELECT 
        u.id, 
        u.email, 
        u.firstname, 
        u.lastname, 
        u.age,
        u.status,
        u.role,
        u.position,
        u.phone_number,
        u.profile_picture_url,
        u.department,
        u.hire_date,
        u.is_active,
        u.skills,
        u.address,
        u.preferences,
        u.working_hours,
        u.vacation_days,
        u.social_links,
        u.created_at,
        u.updated_at,
        (
          SELECT json_agg(
            json_build_object(
              'id', p.id,
              'name', p.name,
              'status', p.status,
              'role', up.role
            )
          )
          FROM user_projects up
          JOIN projects p ON up.project_id = p.id
          WHERE up.user_id = u.id
        ) as projects
      FROM users u
      WHERE u.role != 'admin'
    `;

    const queryParams = [];
    
    if (id) {
      sqlQuery += ` AND u.id = $${queryParams.length + 1}`;
      queryParams.push(id);
    }

    if (department) {
      sqlQuery += ` AND u.department = $${queryParams.length + 1}`;
      queryParams.push(department);
    }

    if (role) {
      sqlQuery += ` AND u.role = $${queryParams.length + 1}`;
      queryParams.push(role);
    }

    if (status) {
      sqlQuery += ` AND u.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }

    sqlQuery += ' ORDER BY u.created_at DESC';

    const employees = await query(sqlQuery, queryParams);
    const employeeRows = Array.isArray(employees.rows) ? employees.rows : [];

    // Remove sensitive information and format data
    const sanitizedEmployees = employeeRows.map(emp => {
      const { password, bank_details, ...safeEmployee } = emp;
      return {
        ...safeEmployee,
        projects: emp.projects || [],
        status: emp.is_active ? 'active' : 'inactive',
        startDate: emp.hire_date
      };
    });

    return NextResponse.json(sanitizedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Error fetching employees' },
      { status: 500 }
    );
  }
}

// POST /api/employees - Create a new employee
export async function POST(request) {
  try {
    const {
      firstname,
      lastname,
      email,
      phone_number,
      department,
      position,
      role,
      hire_date,
      password // Récupération du mot de passe
    } = await request.json();

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel employé
    const result = await query(
      `INSERT INTO users (
        firstname,
        lastname,
        email,
        phone_number,
        department,
        position,
        role,
        hire_date,
        password,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        firstname,
        lastname,
        email,
        phone_number,
        department,
        position,
        role,
        hire_date,
        hashedPassword,
        'active'
      ]
    );

    const newEmployeeId = result.rows[0].id;

    // Récupérer l'employé créé sans le mot de passe
    const newEmployee = await query(
      `SELECT id, firstname, lastname, email, phone_number, department, position, role, hire_date, status
       FROM users WHERE id = $1`,
      [newEmployeeId]
    );

    return NextResponse.json(newEmployee.rows[0]);
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'employé' },
      { status: 500 }
    );
  }
}

// PUT /api/employees - Update an employee
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, firstname, lastname, email, phone_number, department, position, role, hire_date, password } = data;

    if (!id) {
      return NextResponse.json(
        { message: 'ID de l\'employé requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'employé existe
    const checkEmployee = await query('SELECT id FROM users WHERE id = $1', [id]);
    
    if (checkEmployee.rows.length === 0) {
      return NextResponse.json(
        { message: 'Employé non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'email n'est pas déjà utilisé par un autre employé
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, id]
    );
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé par un autre employé' },
        { status: 400 }
      );
    }

    // Préparer la requête SQL de base
    let updateQuery = `
      UPDATE users SET 
        firstname = $1,
        lastname = $2,
        email = $3,
        phone_number = $4,
        department = $5,
        position = $6,
        role = $7,
        hire_date = $8,
        updated_at = CURRENT_TIMESTAMP
    `;

    let queryParams = [firstname, lastname, email, phone_number, department, position, role, hire_date];

    // Si un nouveau mot de passe est fourni, l'ajouter à la requête
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = $' + (queryParams.length + 1);
      queryParams.push(hashedPassword);
    }

    // Ajouter la condition WHERE et RETURNING
    updateQuery += ` WHERE id = $${queryParams.length + 1} 
      RETURNING id, firstname, lastname, email, phone_number, department, position, role, hire_date`;
    queryParams.push(id);

    // Exécuter la requête
    const result = await query(updateQuery, queryParams);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la modification de l\'employé' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees - Delete an employee
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Instead of hard deleting, we'll set is_active to false
    const result = await query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Employee deactivated successfully',
      employeeId: result[0].id
    });
  } catch (error) {
    console.error('Error deactivating employee:', error);
    return NextResponse.json(
      { error: 'Error deactivating employee' },
      { status: 500 }
    );
  }
}