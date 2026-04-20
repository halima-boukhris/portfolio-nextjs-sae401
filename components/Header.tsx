"use client";
import { useEffect, useState } from "react";

export default function Header() {
  // État pour les infos de base (avatar, nom, phrase d'accroche)
  const [data, setData] = useState<any>(null);
  // État pour la liste des réseaux sociaux
  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // On lance les deux appels API en même temps pour optimiser le chargement
        const [resAbout, resSocials] = await Promise.all([
          fetch("/api/about"),
          fetch("/api/reseaux")
        ]);
        setData(await resAbout.json());
        const s = await resSocials.json();
        if (Array.isArray(s)) setSocials(s);

        // Une fois les données reçues, je laisse un petit délai (1s) pour que le DOM se mette à jour
        // Puis on demande à jQuery de recalculer les dimensions et le scroll (nécessaire pour le template HTML5 UP)
        setTimeout(() => {
          const $ = (window as any).jQuery;
          if ($) {
            $(window).trigger('resize');
            $(window).trigger('scroll');
          }
        }, 1000); 

      } catch (e) { console.error(e); }
    }
    fetchData();
  }, []);

  // Si les données ne sont pas encore là, on affiche un header minimaliste
  if (!data) return <header id="header"><nav id="nav"><ul><li><a href="#one"></a></li></ul></nav></header>;

  return (
    <header id="header">
      <div className="inner">
        {/* Section de l'avatar avec gestion d'une image par défaut */}
        <span className="image avatar" style={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '50%', marginTop: '1rem', }}>
          <img 
            src={data.avatar ? `/uploads/${data.avatar}` : "/images/avatar.jpg"} 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </span>
        <h1><strong>{data.nom_logo}</strong></h1>
        <p>{data.phrase_logo}</p>
        
        {/* Génération dynamique des icônes de réseaux sociaux */}
        <ul className="icons">
          {socials.map((social) => (
            <li key={social.id}>
              <a href={social.url} className={`icon brands ${social.icon}`} target="_blank" rel="noopener noreferrer">
                <span className="label">{social.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Menu de navigation ancré sur les IDs de la page principale */}
      <nav id="nav">
        <ul>
          <li><a href="#one">À propos</a></li>
          <li><a href="#two">Compétences</a></li>
          <li><a href="#three">Projets</a></li>
          <li><a href="#four">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}