import { NextResponse } from 'next/server';
import pool from '@/lib/db';


// Récupération de toutes les catégories, triées par ID décroissant (les plus récentes en premier)
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error: any) {
    // En cas de pépin avec la base de données
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    // On récupère le nom depuis le corps de la requête
    const { name } = await req.json();
    // Validation de sécurité pour ne pas insérer de vide
    if (!name) return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });

    await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    // On a besoin de l'ID pour savoir quelle ligne modifier et du nouveau nom
    const { id, name } = await req.json();
    if (!id || !name) return NextResponse.json({ error: "ID et nom requis" }, { status: 400 });

    await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    // On récupère l'ID de la catégorie à supprimer
    const { id } = await req.json();
    
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Cas spécifique : si la catégorie est liée à un projet, la DB bloque la suppression
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json({ 
        error: "Impossible de supprimer : cette catégorie est utilisée par des projets." 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}