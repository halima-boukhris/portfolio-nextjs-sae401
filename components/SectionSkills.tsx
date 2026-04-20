"use client";
import { useEffect, useState } from "react";

export default function SectionSkills() {
  // État pour stocker la liste des compétences 
  const [skills, setSkills] = useState<any[]>([]);
  // État pour gérer l'affichage pendant le chargement
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        // Récupération des données depuis l'API de compétences
        const response = await fetch("/api/competences");
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  // Etat d'attente pour que l'utilisateur sache que les données arrivent
  if (loading) {
    return (
      <section id="two" className="wrapper style2">
        <div className="container">Chargement...</div>
      </section>
    );
  }

  return (
    
    <section id="two" className="wrapper style2" suppressHydrationWarning>
      <div className="container">
        <header className="major">
          <h3>Mes Compétences</h3>
        </header>
        
        {/* Liste des icônes de fonctionnalités (styles CSS du template) */}
        <ul className="feature-icons">
          {skills.map((skill) => {
            // Analyse de la classe d'icône pour déterminer si c'est une marque (brands) ou une icône standard (solid)
            // C'est nécessaire pour que le CSS du template applique les bons styles
            const isBrand = skill.icone.includes("fa-brands") || 
                            skill.icone.includes("fa-react") || 
                            skill.icone.includes("fa-js") || 
                            skill.icone.includes("fa-html5");
            const category = isBrand ? "brands" : "solid";

            return (
              // On injecte dynamiquement la catégorie et le nom de l'icône FontAwesome
              <li key={skill.id} className={`icon ${category} ${skill.icone}`}>
                {skill.texte}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}