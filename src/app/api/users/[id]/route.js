import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const userId = params.id;

    // Get complete user data from database
    const result = await query(
      `SELECT id, email, firstname, lastname, role, position, department, 
              phone_number, profile_picture_url, theme_preference, is_active, status 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Remove sensitive data before sending
    delete user.password;

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des données utilisateur' },
      { status: 500 }
    );
  }
}