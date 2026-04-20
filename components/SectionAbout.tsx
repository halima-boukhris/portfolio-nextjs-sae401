"use client";
import { useEffect, useState } from "react";

export default function SectionAbout() {
  // État pour stocker les données du profil (bio, texte, images)
  const [data, setData] = useState<any>(null);
  // État pour gérer l'affichage pendant la récupération des données
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        // On ajoute un timestamp (?t=...) pour forcer le navigateur à ignorer le cache 
        // et toujours récupérer les dernières modifications faites en admin
        const response = await fetch("/api/about?t=" + Date.now());
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erreur chargement profil:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  // Affichage d'un état de chargement propre tant que les données ne sont pas arrivées
  if (loading || !data) {
    return (
      <section id="one" className="wrapper style1" style={{ minHeight: '80vh' }}>
        <div className="container">Chargement...</div>
      </section>
    );
  }

  // Gestion de la bannière : on utilise celle de la base de données ou une image par défaut
  const bannerPath = data.banner ? `/uploads/${data.banner}` : "/images/banner.jpg";

  return (
    
    <section id="one" className="wrapper style1" suppressHydrationWarning>
      <div className="image main" data-position="center">
        <img src={bannerPath} alt="Bannière" />
      </div>
      
      <div className="container">
        <header className="major">
          {/* On affiche le titre de la bio */}
          <h2>{data.titre_bio || "À propos"}</h2>
        </header>
        
        {/* pre-line permet de conserver les sauts de ligne saisis dans le textarea de l'admin */}
        <p style={{ whiteSpace: "pre-line" }}>
          {data.texte_intro}
        </p>

        {/* On n'affiche la section CV que si un fichier est présent en base de données */}
        {data.cv_file && (
          <ul className="actions">
            <li>
              <a 
                href={`/uploads/${data.cv_file}`} 
                className="button" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Voir mon CV
              </a>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}