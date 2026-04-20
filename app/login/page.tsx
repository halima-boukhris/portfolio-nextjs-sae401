'use client';

// Cette page gère l'authentification de l'administrateur pour accéder au dashboard
import { useState } from 'react'; 
import { useRouter } from 'next/navigation'; 
import { signIn } from 'next-auth/react'; 

export default function LoginPage() {
  const router = useRouter();
  // États pour capturer la saisie utilisateur et afficher les erreurs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // On réinitialise l'erreur à chaque tentative
    
    // On utilise la méthode signIn de NextAuth avec le provider 'credentials'
    // redirect: false permet de gérer manuellement la redirection ou l'affichage de l'erreur
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false, 
    });

    if (result?.ok) {
      // Si l'authentification réussit, on redirige vers l'admin et on rafraîchit la session
      router.push('/admin'); 
      router.refresh(); 
    } else {
      // Sinon, on affiche un message d'erreur générique pour la sécurité
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  return ( 
    // Layout simple centré pour le formulaire de connexion
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Connexion Admin</h1>
        
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}> 
          {/* Champ Nom d'utilisateur */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#666' }}>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #ddd', borderRadius: '4px', color: '#000' }}
              placeholder="nom d'utilisateur"
              required
            />
          </div>
          
          {/* Champ Mot de passe */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#666' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #ddd', borderRadius: '4px', color: '#000' }}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}