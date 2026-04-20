import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; 
import bcrypt from 'bcrypt'; 

export async function POST(request: Request) {
  try {
    // On récupère les identifiants envoyés par le front
    const { username, password } = await request.json();

    // On cherche l'admin en base par son nom d'utilisateur
    const [rows]: any = await pool.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    // Si on a un utilisateur correspondant
    if (rows.length > 0) {
      const admin = rows[0];
      
      // On compare le mot de passe en clair reçu avec le hash stocké en base
      const isMatch = await bcrypt.compare(password, admin.password);

      if (isMatch) {
        
        return NextResponse.json({ message: "Succès" }, { status: 200 });
      }
    }
      
    // Pour des raisons de sécurité, on renvoie la même erreur que le user n'existe pas ou que le mot de passe soit faux
      return NextResponse.json({ message: "Identifiants incorrects" }, { status: 401 });
    
  } catch (error: any) {
    console.error('Erreur Login API:', error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}