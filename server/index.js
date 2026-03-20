/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   Pierre-Cédric Computer & Phone Solution                ║
 * ║   Serveur principal — Express + Sequelize + SQLite       ║
 * ╚══════════════════════════════════════════════════════════╝
 */

require('dotenv').config();
const app              = require('./config/app');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 5000;

// Démarrage asynchrone : sync BD puis écoute
(async () => {
  try {
    // Synchronise (crée/altère) toutes les tables SQLite automatiquement
    await syncDatabase();

    app.listen(PORT, () => {
      console.log('\n╔══════════════════════════════════════════════╗');
      console.log(`║  🚀 Pierre-Cédric API démarré                ║`);
      console.log(`║  📡 http://localhost:${PORT}                    ║`);
      console.log(`║  🌍 ENV: ${process.env.NODE_ENV}                         ║`);
      console.log('╚══════════════════════════════════════════════╝\n');
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage :', error);
    process.exit(1);
  }
})();
