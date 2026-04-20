import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY date_creation DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    
    const nom = body.nom || "";
    const prenom = body.prenom || "";
    const email = body.email || "";
    const sujet = body.sujet || "Sans sujet";
   
    const contenu = body.contenu || body.message || "";

    
    if (!nom || !prenom || !email || !contenu) {
      return NextResponse.json(
        { error: 'Certains champs obligatoires sont vides.' }, 
        { status: 400 }
      );
    }

    
    await pool.query(
      'INSERT INTO messages (nom, prenom, email, sujet, contenu, date_creation) VALUES (?, ?, ?, ?, ?, NOW())',
      [nom, prenom, email, sujet, contenu]
    );

    return NextResponse.json({ success: true });

  } catch (error: any) {
    
    console.error("ERREUR SQL :", error.message);
    
    return NextResponse.json(
      { error: 'Erreur lors de l’envoi', details: error.message }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}