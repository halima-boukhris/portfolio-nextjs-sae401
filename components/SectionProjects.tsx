"use client";
import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

export default function SectionProjects() {
  // État pour stocker la liste complète des projets
  const [projets, setProjets] = useState([]);
  // État pour le filtre de catégorie actuel ("Tous" par défaut)
  const [filtre, setFiltre] = useState("Tous");
  // État pour gérer l'affichage pendant que les données chargent
  const [loading, setLoading] = useState(true);

  // Récupération des projets via l'API au montage du composant
  useEffect(() => {
    async function fetchProjets() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjets(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur :", error);
        setLoading(false);
      }
    }
    fetchProjets();
  }, []);

  // Affichage d'attente si les données ne sont pas encore là
  if (loading) {
    return (
      <section id="three" className="wrapper style3">
        <div className="container">
          <h3>Mes Projets</h3>
          <p>Chargement des projets...</p>
        </div>
      </section>
    );
  }

  // On génère dynamiquement la liste des catégories uniques à partir des projets reçus
  const categories = [
    "Tous", 
    ...Array.from(new Set(projets.map((p) => p.category_name))).filter(Boolean)
  ];

  // Logique de filtrage : si "Tous" est sélectionné, on montre tout, sinon on filtre par catégorie
  const projetsFiltres = filtre === "Tous"
    ? projets
    : projets.filter((p) => p.category_name === filtre);

  return (
    
    <section id="three" className="wrapper style3" suppressHydrationWarning>
      <div className="container">
        <h3>Mes Projets</h3>

        {/* Navigation pour les filtres */}
        <nav style={{ marginBottom: "40px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltre(cat)}
              style={{
                backgroundColor: filtre === cat ? "#66022a" : "transparent",
                color: filtre === cat ? "#ffffff" : "#66022a",
                border: "2px solid #66022a",
                padding: "8px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8em",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                outline: "none"
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Affichage de la grille des projets filtrés */}
        <div className="features">
          {projetsFiltres.map((projet) => (
            <ProjectCard
              key={projet.id}
              id={projet.id}
              title={projet.title}
              description={projet.description}
              image={projet.image}
              category={projet.category_name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}