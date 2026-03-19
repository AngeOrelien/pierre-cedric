require('dotenv').config();

const app = require('./config/app');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 5000;

(async () => {
    await syncDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Serveur Pierre-Cedric sur http://localhost:${PORT}`);
    });
})();