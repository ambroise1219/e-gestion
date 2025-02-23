import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      success: true,
      message: 'Déconnexion réussie' 
    });
    
    // Supprimer le cookie de session
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la déconnexion' },
      { status: 500 }
    );
  }
}