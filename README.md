# Gestion d'un Portfolio Dynamique

**Projet réalisé par : ALI Alice, BERNOS Alicya, BOUTWIL Salma et BOUKHRIS Halima**

BUT MMI - 2ème année (2025-2026)

---

**Lien du Portfolio** : https://portfolio-nextjs-sae401.vercel.app

**Lien du dépôt GitHub** : https://github.com/halima-boukhris/portfolio-nextjs-sae401/

---

Ce projet a été réalisé dans le cadre du BUT MMI, pour la SAE 401. L'objectif était de réaliser un portfolio dynamique gérable par un back-office relié à une base de données MySQL. Ce back-office est accessible par l'administrateur grâce à un formulaire de connexion. 
Précedemment conçu en PHP (à partir d'un template statique "ReadOnly" de HTML5UP), ce projet a été migré vers React et Next.js, en utilisant notamment Toolpad Core pour la structure de l'interface d'administration.

Ce back-office permet à un utilisateur, même sans connaissances en développement web, de gérer de manière simple grâce à une interface intuitive, son portfolio et ajouter, visualiser, modifier, supprimer du contenu à sa guise grâce à un système "CRUD" sans toucher au code ou à la base de données.

## INSTALLATION

Dans le terminal :

**1. Cloner le projet**

```bash

git clone https://github.com/halima_boukhris/portfolio-nextjs-sae401.git
cd portfolio-nextjs-sae401

```
    
    
**2. Installer des dépendances**

```bash

npm install

```
        

**3. Configurer l'environnement**

Créez un fichier `.env.local` à la racine et ajoutez vos accès MySQL : 

```bash

DB_HOST=votre_hote
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=votre_nom_de_bdd
NEXTAUTH_SECRET=votre_phrase_secrete

```


## LANCEMENT DU RPOJET

Exécutez la commande suivante à la racine du projet :

```bash

npm run dev

```

Le projet est accessible en local sur http://localhost:3000


## STRUCTURE DU PROJET

L'arborescence suit la logique du Next.js App Router, ce qui permet une séparation claire et sécurisée entre les différentes fonctionnalités de l'application :

### Dossiers Principaux (Racine)

**`/app`** : C'est le coeur de l'application. Il contient l'ensemble des routes/pages, les layouts (structures communes) et la logique de navigation.

**`/components`** : Regroupe les composants React réutilisables (boutons, barre de navigation etc.).

**`/lib`** : Centralise la logique technique, notamment la configuration du pool de connexion MySQL (via `db.ts`).

**`/public`** : Stocke les ressources. Il inclut le dossier `/assets` (CSS,JS et polices du tepmplate original) et le dossier `/uploads` pour les fichiers (images, CV en PDF etc.).


### Dossier /app

**Racine de /app** : Regroupe principalement le layout principal et la page d'accueil du protfolio visibles au public. La structure gère dynamiquement le chargement des ressources (scripts et styles) tout en intégrant l'intéractivité du portfolio.

**/app/login** : Page de connexion sécurisée utilisant NextAuth.

**/app/admin** : Espace d'administration protégé. Cette zone est accessible seulement après authentification réussie.

**/app/api** : Contient les points d'entrée de l'API. Ils font le pont entre le front-end et la base de données pour exécuter les opérations CRUD (Create, Read, Update, Delete).


### Sécurité des données

**NextAuth et Middleware** : La sécurité est renforcée par un fichier middleware.ts (à la racine) qui restreint l'accès à toutes les routes `/admin/` aux seuls utilisateurs authentifiés.

**Bcrypt** : Utilisé pour le hachage des mots de passe. Lors de l'authentification, le système compare les empreintes numériques (hash) plutôt que les mots de passe en clair. Cela permet de garantir la confidentialité des identifiants.
    

       





