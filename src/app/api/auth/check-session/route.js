import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier le token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    );

    // Récupérer les données à jour de l'utilisateur
    const result = await query(`
      SELECT 
        id, 
        email,
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
      WHERE id = $1
    `, [payload.userId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 401 });
    }

    const user = result.rows[0];

    // Mettre à jour la dernière activité
    await query(
      'UPDATE users SET last_login_date = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ message: 'Session invalide' }, { status: 401 });
  }
}