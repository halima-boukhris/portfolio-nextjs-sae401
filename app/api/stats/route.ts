import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Route pour récupérer les statistiques globales (utilisées sur le tableau de bord admin)
export async function GET() {
  try {
    // On récupère le nombre total d'entrées pour chaque section principale de la base de données
    const [projectRows]: any = await pool.query('SELECT COUNT(*) as total FROM projects');
    const [compRows]: any = await pool.query('SELECT COUNT(*) as total FROM competences');
    const [msgRows]: any = await pool.query('SELECT COUNT(*) as total FROM messages');

    // On renvoie un objet JSON récapitulatif avec les différents compteurs
    return NextResponse.json({
      projets: projectRows[0].total,
      competences: compRows[0].total,
      messages: msgRows[0].total
    });
  } catch (error) {
    
    console.error(error);
    return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
  }
}