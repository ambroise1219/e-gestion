const { Pool } = require('pg');

// Configuration du pool de connexion
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Fonction pour exécuter une requête
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Exécution de la requête', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erreur dans la requête', { text, error });
    throw error;
  }
}

// Fonction pour obtenir un client du pool
async function getClient() {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Définir un timeout sur les requêtes
  const timeout = setTimeout(() => {
    console.error('Un client a été gardé trop longtemps');
    console.error(`La requête qui a causé le problème était ${client.lastQuery}`);
  }, 5000);

  // Intercepter les requêtes pour les logger
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
}

module.exports = {
  query,
  getClient,
  pool
};