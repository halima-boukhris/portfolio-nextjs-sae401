"use client";
import { useEffect } from "react";
import Header from "@/components/Header";
import SectionAbout from "@/components/SectionAbout";
import SectionProjects from "@/components/SectionProjects";
import SectionSkills from "@/components/SectionSkills";
import SectionContact from "@/components/SectionContact";

export default function Home() {
  useEffect(() => {
  
  //Configuration de la détection de la section active dans la navigation
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px', 
    threshold: 0
  };

  //Logique de mise à jour du menu de navigation en fonction de la section visible
  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      //Si une section entre dans la zone définie
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const navLinks = document.querySelectorAll('#nav ul li a');
        
        //On nettoie les liens et on active celui qui correspond à la section visible
        navLinks.forEach((link) => {
          link.classList.remove('active');//Retire la classe active de tous les liens
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');//Ajoute la classe active au lien qui correspond à la section visible
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  
  const timer = setTimeout(() => {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
  }, 1000);

  return () => {
    observer.disconnect();
    clearTimeout(timer);
  };
}, []);

  return (
    <div id="wrapper">
      <div id="main">
        <SectionAbout />
        <SectionSkills />
        <SectionProjects />
        <SectionContact />
      </div>
      <Header />
    </div>
  );
}