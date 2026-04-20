// On force le mode dynamique pour être sûr de toujours récupérer les dernières infos de la DB sans cache
export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Handler pour récupérer les informations de la page "À Propos"
export async function GET() {
  try {
    // On récupère l'unique enregistrement (ID=1) qui contient toutes les données du profil
    const [rows]: any = await pool.query('SELECT * FROM about WHERE id = 1');
    // On renvoie la première ligne ou un objet vide si rien n'est trouvé
    return NextResponse.json(rows[0] || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Handler pour mettre à jour les informations du profil
export async function PUT(req: Request) {
  try {
    // On récupère le corps de la requête envoyé par le client
    const data = await req.json();

    // Préparation de la requête de mise à jour pour le record ID=1
    const query = `
      UPDATE about 
      SET 
        nom_logo = ?, 
        phrase_logo = ?, 
        titre_bio = ?, 
        sous_titre_bio = ?, 
        texte_intro = ?, 
        email_contact = ?, 
        telephone = ?, 
        avatar = ?, 
        banner = ?, 
        cv_file = ? 
      WHERE id = 1
    `;

    // On mappe les données reçues dans l'ordre de la requête SQL
    const values = [
      data.nom_logo,
      data.phrase_logo,
      data.titre_bio,
      data.sous_titre_bio || '', 
      data.texte_intro,
      data.email_contact,
      data.telephone,
      data.avatar,
      data.banner,
      data.cv_file
    ];

    // Exécution de la requête
    await pool.query(query, values);

    return NextResponse.json({ message: "Profil mis à jour avec succès !" });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}