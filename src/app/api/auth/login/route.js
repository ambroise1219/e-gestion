import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Get user from database with all relevant fields
    const result = await query(`
      SELECT 
        id, 
        email, 
        password, 
        firstname, 
        lastname, 
        age,
        status,
        role,
        position,
        phone_number,
        profile_picture_url,
        theme_preference,
        department,
        hire_date,
        last_login_date,
        is_active,
        emergency_contact,
        skills,
        address,
        preferences,
        working_hours,
        vacation_days,
        social_links,
        security_clearance,
        workspace_settings,
        notification_preferences,
        created_at,
        updated_at
      FROM users 
      WHERE email = $1
    `, [email]);

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Remove sensitive data before creating token
    const { password: _, ...userWithoutPassword } = user;

    // Create token with extended user data
    const token = jwt.sign(
      { 
        userId: user.id,
        ...userWithoutPassword
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Update last login date
    await query(
      'UPDATE users SET last_login_date = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Créer la réponse avec les cookies
    const response = NextResponse.json({ 
      token, 
      user: userWithoutPassword
    });

    // Définir le cookie de session sécurisé
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 heures
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}