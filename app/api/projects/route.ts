import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      /* Jointure pour récupérer le nom de la catégorie */
      SELECT p.*, c.name AS category_name 
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.position ASC
    `;
    const [rows] = await pool.query(query);
    
    // On s'assure que rows est bien un tableau
    return NextResponse.json(rows || []); 
  } catch (error: any) {
    console.error("Erreur SQL GET :", error.message);
    // On renvoie un tableau vide en cas d'erreur pour éviter de casser le front-end
    return NextResponse.json([], { status: 500 });
  }
}


// Création d'un nouveau projet
export async function POST(req: Request) {
  try {
    // On extrait les champs envoyés par le formulaire admin
    const { title, description, image, video_url, category_id, position } = await req.json();
    
    const [result]: any = await pool.query(
      'INSERT INTO projects (title, description, image, video_url, category_id, position) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image, video_url || '', category_id, position || 0]
    );
    
    // On renvoie l'ID généré pour confirmer la création
    return NextResponse.json({ id: result.insertId, title });
  } catch (error: any) {
    console.error("Erreur SQL POST :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Mise à jour d'un projet existant
export async function PUT(req: Request) {
  try {
    // On récupère toutes les infos, l'ID est indispensable pour le WHERE
    const { id, title, description, image, video_url, category_id, position } = await req.json();
    
    await pool.query(
      'UPDATE projects SET title = ?, description = ?, image = ?, video_url = ?, category_id = ?, position = ? WHERE id = ?',
      [title, description, image, video_url, category_id, position, id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur SQL PUT :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Suppression d'un projet
export async function DELETE(req: Request) {
  try {
    // On a besoin de l'ID envoyé dans le body pour supprimer la ligne
    const { id } = await req.json();
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur SQL DELETE :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}