import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Récupération de tous les réseaux sociaux
export async function GET() {
  try {
    // On trie par position (pour l'ordre d'affichage) puis par ID
    const [rows] = await pool.query('SELECT * FROM reseaux_sociaux ORDER BY position ASC, id ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    // En cas d'erreur, on renvoie le message pour faciliter le debug
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Création d'un nouveau lien social
export async function POST(req: Request) {
  try {
    // On récupère les infos du body
    const { name, url, icon, position } = await req.json();
    // Insertion sécurisée : on définit une icône et une position par défaut si elles manquent
    const [result]: any = await pool.query(
      'INSERT INTO reseaux_sociaux (name, url, icon, position) VALUES (?, ?, ?, ?)',
      [name, url, icon || 'fa-link', position || 0] 
    );
    // On renvoie l'objet créé avec son nouvel ID
    return NextResponse.json({ id: result.insertId, name, url, icon, position });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Mise à jour d'un réseau existant
export async function PUT(req: Request) {
  try {
    const { id, name, url, icon, position } = await req.json();
    // On met à jour tous les champs pour l'ID correspondant
    await pool.query(
      'UPDATE reseaux_sociaux SET name = ?, url = ?, icon = ?, position = ? WHERE id = ?',
      [name, url, icon, position, id]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Suppression d'un réseau
export async function DELETE(req: Request) {
  try {
    // Seul l'ID est nécessaire pour la suppression
    const { id } = await req.json();
    
    await pool.query('DELETE FROM reseaux_sociaux WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}