import mysql from 'mysql2/promise';

//On reutilise la même connexion à la base de données pour éviter d'en créer une nouvelle à chaque requête
const globalForDb = global as unknown as { pool: mysql.Pool };

export const pool = globalForDb.pool || mysql.createPool({
  //On récupère les informations de connexion à la base de données depuis le fichier .env.local
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  //On limite le nombre de connexions en même temps pour éviter de surcharger la base de données
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//On stocke la connexion dans une variable globale pour pouvoir la réutiliser dans les autres fichiers
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export default pool;