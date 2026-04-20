import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Récupère toutes les compétences enregistrées en base de données
export async function GET() {
  try {
    // Exécution de la requête SQL simple
    const [rows] = await pool.query('SELECT * FROM competences');
    return NextResponse.json(rows);
  } catch (error) {
    // On log l'erreur côté serveur et on renvoie un message propre au client
    console.error('Erreur GET /api/competences:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// Ajoute une nouvelle compétence (ex: 'React', 'fa-brands fa-react')
export async function POST(req: Request) {
  try {
    // On récupère l'icône (classe FontAwesome) et le libellé
    const { icone, texte } = await req.json();
    
    // Insertion sécurisée via des paramètres préparés
    const [result]: any = await pool.query(
      'INSERT INTO competences (icone, texte) VALUES (?, ?)',
      [icone, texte]
    );
    
    // On retourne l'ID généré pour que le front puisse l'utiliser immédiatement
    return NextResponse.json({ id: result.insertId, success: true });
  } catch (error) {
    console.error('Erreur POST /api/competences:', error);
    return NextResponse.json({ error: 'Erreur lors de l’ajout' }, { status: 500 });
  }
}

// Met à jour une compétence existante
export async function PUT(req: Request) {
  try {
    // On extrait l'ID et les nouveaux champs
    const { id, icone, texte } = await req.json();
    
    // Mise à jour basée sur l'identifiant unique
    await pool.query(
      'UPDATE competences SET icone = ?, texte = ? WHERE id = ?',
      [icone, texte, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur PUT /api/competences:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// Supprime une compétence de la base
export async function DELETE(req: Request) {
  try {
    // Seul l'ID est nécessaire pour identifier l'entrée à supprimer
    const { id } = await req.json();
    
    await pool.query('DELETE FROM competences WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/competences:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}