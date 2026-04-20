"use client";
import { useState } from "react";

export default function SectionContact() {
  // État pour regrouper toutes les données du formulaire
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    sujet: "",
    contenu: "",
  });
  
  // État pour désactiver le bouton pendant l'envoi
  const [loading, setLoading] = useState(false);
  // État pour afficher un message de succès ou d'erreur après l'envoi
  const [statut, setStatut] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });

  // Fonction générique pour mettre à jour le state en fonction du "name" de l'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // On lance le chargement
    setStatut({ type: null, msg: "" });

    try {
      // Envoi des données à l'API demessages
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Si ça marche, on affiche un message de succès et on vide le formulaire
        setStatut({ type: 'success', msg: "Votre message a bien été envoyé !" });
        setFormData({ prenom: "", nom: "", email: "", sujet: "", contenu: "" });
      } else {
        // Si le serveur renvoie une erreur (ex: 400 ou 500)
        throw new Error();
      }
    } catch (err) {
      setStatut({ type: 'error', msg: "Erreur lors de l'envoi." });
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <section id="four" className="wrapper style2" suppressHydrationWarning>
      <div className="container">
        <h3>Contactez-moi</h3>

        {/* Affichage du message de retour (succès ou erreur) */}
        {statut.msg && (
          <p style={{ color: statut.type === 'success' ? "#4CAF50" : "#FF5252", fontWeight: "bold" }}>
            {statut.msg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row gtr-uniform">
            <div className="col-6 col-12-xsmall">
              <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required />
            </div>
            <div className="col-6 col-12-xsmall">
              <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <input type="text" name="sujet" placeholder="Sujet" value={formData.sujet} onChange={handleChange} />
            </div>
            <div className="col-12">
              <textarea
                name="contenu"
                placeholder="Message"
                rows={6}
                value={formData.contenu}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="col-12">
              <ul className="actions">
                <li>
                  {/* Le bouton change de texte et se désactive pendant l'envoi */}
                  <input 
                    type="submit" 
                    className="primary" 
                    value={loading ? "Envoi..." : "Envoyer"} 
                    disabled={loading} 
                  />
                </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}