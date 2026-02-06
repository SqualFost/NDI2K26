const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

// --- 1. FONCTION D'INITIALISATION BDD ---
async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS CreditAgricole;`);
  console.log("✅ Base de données 'CreditAgricole' vérifiée/créée.");
  await connection.end();
}

// --- 2. IMPORTS ---
const db = require('./models');

const apiUtilisateursRouter = require('./routes/apiUtilisateur');
const apiProjetRouter = require('./routes/apiProjet');
const apiImageRouter = require('./routes/apiImage');



const app = express();

// --- 3. MIDDLEWARES ---
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Moteur de vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Fichiers statiques
app.use(express.static('public'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// --- 4. ROUTES ---

app.use('/api/utilisateurs', apiUtilisateursRouter);
app.use('/api/projets', apiProjetRouter);
app.use('/api/images', apiImageRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get('/api', (req, res) => {
  res.redirect('/api-docs');
});
// --- 5. GESTION ERREURS ---
app.use((req, res, next) => {
  if (req.accepts('json')) {
    res.status(404).json({ message: 'Route non trouvée' });
  } else {
    res.status(404).render('404');
  }
});

app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err);
  if (req.accepts('json')) {
    res.status(err.status || 500).json({ message: err.message || 'Erreur interne' });
  } else {
    // Assure-toi d'avoir une vue 'error.ejs'
    res.status(err.status || 500).render('error', { error: err });
  }
});

// --- 6. DÉMARRAGE SÉQUENTIEL ---
const PORT = process.env.PORT || 3001;

initializeDatabase()
  .then(() => {
    console.log("🔄 Tentative de synchronisation des tables...");
    return db.sequelize.sync({ alter: true });
  })
  .then(async () => {

    // On lance le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur critique au démarrage :", err);
  });

module.exports = app;