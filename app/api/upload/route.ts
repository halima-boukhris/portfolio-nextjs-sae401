import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    // On récupère les données du formulaire, notamment le fichier
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Sécurité l'utilisateur n'a rien envoyé
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    // On définit le chemin vers le dossier de stockage (public/uploads à la racine)
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    // On s'assure que le dossier existe bien, sinon on le crée (recursive: true)
    await mkdir(uploadDir, { recursive: true });

    // On crée un nom unique en ajoutant le timestamp actuel pour éviter les conflits
    // On remplace aussi les espaces par des underscores pour avoir une URL propre
    const uniqueFileName = `${Date.now()}-${file.name.replaceAll(' ', '_')}`;
    const path = join(uploadDir, uniqueFileName);

    // Conversion du fichier en buffer pour l'écriture physique sur le disque
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path, buffer);

    
    return NextResponse.json({ 
      success: true, 
      filename: uniqueFileName 
    });

  } catch (error: any) {
    console.error("Erreur Upload:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}