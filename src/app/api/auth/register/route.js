import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password, firstname, lastname, phone_number, role } = await request.json();

    // Validate all required fields
    if (!email || !password || !firstname || !lastname || !phone_number || !role) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const result = await query(
      'INSERT INTO users (email, password, firstname, lastname, phone_number, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, firstname, lastname, role',
      [email, hashedPassword, firstname, lastname, phone_number, role]
    );

    const user = result.rows[0];

    // Create token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      message: 'Inscription réussie',
      token,
      user: { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}