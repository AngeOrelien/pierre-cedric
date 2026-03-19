const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('../routes');
const errprMiddleware = require('../middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // pour parser les données de formulaire dans le corps de la requête

// servir les images uploadees
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// test pour returner index.html 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// routes API
app.use('/api', routes);

// middleware d'erreur global (toujours en dernier)
app.use(errprMiddleware);

module.exports = app;