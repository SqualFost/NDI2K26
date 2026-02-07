const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
// Si tu n'as pas encore généré le swagger, commente la ligne ci-dessous pour éviter le crash
// const swaggerFile = require('./swagger-output.json'); 
// Pour l'instant on met un objet vide pour éviter l'erreur si le fichier manque
const swaggerFile = require('./swagger-output.json'); 

// --- 1. CONFIGURATION BDD & IMPORTS ---
const db = require('./models');

const apiUtilisateursRouter = require('./routes/apiUtilisateur');
const apiProjetRouter = require('./routes/apiProjet');
const apiImageRouter = require('./routes/apiImage');

const app = express();
app.use(express.static('public'));
// --- 2. FONCTION D'INITIALISATION BDD (Création de la base si inexistante) ---
async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Ton mot de passe root ici
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS CreditAgricole;`);
  console.log("✅ Base de données 'CreditAgricole' vérifiée.");
  await connection.end();
}

// --- 3. FONCTION DE REMPLISSAGE (SEED) ---
async function seedDatabase() {
  try {
    console.log("🌱 Vérification des données initiales...");

    // 1. UTILISATEURS (Sièges sociaux répartis 83/06/04)
    const utilisateurs = [
      { id: 1, nom: 'Admin', prenom: 'Fondation CA', adresse: 'Draguignan', dob: '1990-01-01', mot_de_passe: 'admin2025', role: 'ADMIN' },
      { id: 2, nom: 'Assoc', prenom: 'Chant des Dauphins', adresse: 'Port-Fréjus', dob: '2000-06-15', mot_de_passe: 'mer83', role: 'USER' }, // 83
      { id: 3, nom: 'Assoc', prenom: 'Recyclerie Gare', adresse: 'Manosque', dob: '2015-03-10', mot_de_passe: 'velo04', role: 'USER' }, // 04
      { id: 4, nom: 'Assoc', prenom: 'AVATH', adresse: 'Toulon', dob: '1998-09-22', mot_de_passe: 'miam83', role: 'USER' }, // 83
      { id: 5, nom: 'Musée', prenom: 'Dinosaures', adresse: 'Nice', dob: '2025-06-07', mot_de_passe: 'raptor06', role: 'USER' } // 06
    ];
    await db.Utilisateur.bulkCreate(utilisateurs, { ignoreDuplicates: true });

    // 2. PROJETS (Uniquement 83, 06, 04)
    const projets = [
      // --- VAR (83) ---
      { id: 1, nom: 'Voile Bonheur', longitude: 6.733, latitude: 43.433, description: 'Sorties en mer pour public handicapé.', utilisateur_id: 2, date_debut: '2025-05-01', budget: 5000, categorie: 'Social', localisation: 'Port-Fréjus' },
      { id: 2, nom: 'Atelier Vélo Solidaire', longitude: 6.128, latitude: 43.120, description: 'Réparation de vélos et insertion.', utilisateur_id: 3, date_debut: '2025-02-15', budget: 2500, categorie: 'Environnement', localisation: 'Hyères' },
      { id: 3, nom: 'Comptoir Bistrot Chalucet', longitude: 5.927, latitude: 43.124, description: 'Restauration solidaire inclusive.', utilisateur_id: 4, date_debut: '2025-10-01', budget: 3200, categorie: 'Social', localisation: 'Toulon' },
      { id: 4, nom: 'Musée Dinosaures', longitude: 6.100, latitude: 43.580, description: 'Musée sur site paléontologique.', utilisateur_id: 5, date_debut: '2025-06-07', budget: 7000, categorie: 'Culture', localisation: 'Fox-Amphoux' },
      { id: 6, nom: 'Jardin Partagé Toulonnais', longitude: 5.930, latitude: 43.125, description: 'Jardin partagé urbain.', utilisateur_id: 4, date_debut: '2025-04-20', budget: 1200, categorie: 'Social', localisation: 'Toulon' },
      { id: 11, nom: 'Atelier Cirque St-Raphaël', longitude: 6.768, latitude: 43.425, description: 'Cirque pour adolescents.', utilisateur_id: 3, date_debut: '2025-09-01', budget: 2200, categorie: 'Culture', localisation: 'Saint-Raphaël' },
      { id: 12, nom: 'Festival du Livre', longitude: 6.130, latitude: 43.121, description: 'Festival et ateliers écriture.', utilisateur_id: 3, date_debut: '2025-10-12', budget: 3000, categorie: 'Culture', localisation: 'Hyères' },
      { id: 13, nom: 'Randonnée Seniors', longitude: 6.463, latitude: 43.540, description: 'Activités plein air seniors.', utilisateur_id: 2, date_debut: '2025-03-20', budget: 1000, categorie: 'Social', localisation: 'Draguignan' },
      { id: 16, nom: 'Cuisine Solidaire', longitude: 5.935, latitude: 43.122, description: 'Apprendre à cuisiner sain.', utilisateur_id: 4, date_debut: '2025-05-10', budget: 2000, categorie: 'Social', localisation: 'Toulon' },
      { id: 17, nom: 'Observatoire Oiseaux', longitude: 6.180, latitude: 43.100, description: 'Protection nature aux Salins.', utilisateur_id: 2, date_debut: '2025-07-05', budget: 2200, categorie: 'Environnement', localisation: 'Hyères (Salins)' },
      { id: 19, nom: 'Nettoyage Esterel', longitude: 6.800, latitude: 43.450, description: 'Nettoyage massif du massif.', utilisateur_id: 2, date_debut: '2025-09-10', budget: 1300, categorie: 'Environnement', localisation: 'Fréjus (Esterel)' },
      { id: 20, nom: 'Club Lecture', longitude: 6.135, latitude: 43.118, description: 'Lecture jeunes adultes.', utilisateur_id: 3, date_debut: '2025-10-01', budget: 900, categorie: 'Culture', localisation: 'Hyères' },
      { id: 23, nom: 'Bibliothèque Mobile', longitude: 6.470, latitude: 43.535, description: 'Culture en zone rurale.', utilisateur_id: 5, date_debut: '2025-06-08', budget: 2500, categorie: 'Culture', localisation: 'Draguignan' },

      // --- ALPES-MARITIMES (06) ---
      { id: 7, nom: 'Atelier Peinture Nice', longitude: 7.262, latitude: 43.703, description: 'Art inclusif pour tous.', utilisateur_id: 3, date_debut: '2025-06-05', budget: 2000, categorie: 'Culture', localisation: 'Nice' },
      { id: 8, nom: 'Nettoyage Plage', longitude: 7.017, latitude: 43.551, description: 'Action citoyenne plages.', utilisateur_id: 2, date_debut: '2025-07-10', budget: 1500, categorie: 'Environnement', localisation: 'Cannes' },
      { id: 10, nom: 'Patrimoine Menton', longitude: 7.500, latitude: 43.775, description: 'Valorisation du patrimoine.', utilisateur_id: 5, date_debut: '2025-05-30', budget: 6000, categorie: 'Culture', localisation: 'Menton' },
      { id: 14, nom: 'Éco-Cyclo Nice', longitude: 7.265, latitude: 43.710, description: 'Mobilité douce urbaine.', utilisateur_id: 3, date_debut: '2025-04-18', budget: 1800, categorie: 'Environnement', localisation: 'Nice' },
      { id: 18, nom: 'Festival Jazz Off', longitude: 7.270, latitude: 43.695, description: 'Concerts gratuits quartiers.', utilisateur_id: 5, date_debut: '2025-08-20', budget: 4000, categorie: 'Culture', localisation: 'Nice' },
      { id: 22, nom: 'Danse Inclusive', longitude: 7.020, latitude: 43.555, description: 'Danse mixte handi-valide.', utilisateur_id: 4, date_debut: '2025-05-12', budget: 1800, categorie: 'Culture', localisation: 'Cannes' },
      { id: 24, nom: 'Jardinage Enfants', longitude: 7.495, latitude: 43.780, description: 'Nature en ville.', utilisateur_id: 2, date_debut: '2025-07-15', budget: 1500, categorie: 'Environnement', localisation: 'Menton' },

      // --- ALPES-DE-HAUTE-PROVENCE (04) ---
      { id: 5, nom: 'Randonnée Verdon', longitude: 6.512, latitude: 43.846, description: 'Eco-tourisme dans les Gorges.', utilisateur_id: 2, date_debut: '2025-03-12', budget: 1800, categorie: 'Environnement', localisation: 'Castellane' },
      { id: 9, nom: 'Bistrot des Alpes', longitude: 6.235, latitude: 44.092, description: 'Repas solidaires chauds.', utilisateur_id: 4, date_debut: '2025-08-15', budget: 3500, categorie: 'Social', localisation: 'Digne-les-Bains' },
      { id: 15, nom: 'Théâtre Manosquin', longitude: 5.783, latitude: 43.833, description: 'Théâtre pour tous.', utilisateur_id: 4, date_debut: '2025-06-25', budget: 2500, categorie: 'Culture', localisation: 'Manosque' },
      { id: 21, nom: 'Récup’ Vélos 04', longitude: 5.943, latitude: 44.197, description: 'Mobilité rurale durable.', utilisateur_id: 3, date_debut: '2025-03-15', budget: 2000, categorie: 'Environnement', localisation: 'Sisteron' },
    ];
    await db.Projet.bulkCreate(projets, { ignoreDuplicates: true });

   // 3. IMAGES
    const images = [
      { id: 16, projet_id: 2, url: '/images/projets/b39f07f8-e8b8-4cc9-87e0-56f52df33d60.png', isMain: true, isPreview: false },
      { id: 17, projet_id: 4, url: '/images/projets/51575f36-67bf-4b1f-949c-50a69d1005a9.png', isMain: true, isPreview: false },
      { id: 18, projet_id: 11, url: '/images/projets/370e0d1a-26b8-4941-abb8-a25fa23f9ad1.png', isMain: true, isPreview: false },
      { id: 19, projet_id: 16, url: '/images/projets/433f4f6d-b205-467b-8ab8-66a15eb9295d.png', isMain: true, isPreview: false },
      { id: 20, projet_id: 6, url: '/images/projets/78e598b2-6383-41b0-a2e9-c9e7562ec364.png', isMain: true, isPreview: false },
      { id: 21, projet_id: 3, url: '/images/projets/f108df20-81e3-454e-8bfd-80692fe39d7b.png', isMain: true, isPreview: false },
      { id: 22, projet_id: 1, url: '/images/projets/5ec8f18c-1654-4daf-b062-0dbc98d666f5.png', isMain: true, isPreview: false },
      { id: 23, projet_id: 13, url: '/images/projets/c77a3f7c-83d1-4ada-987d-49d5ab6d8c5c.png', isMain: true, isPreview: false },
      { id: 24, projet_id: 17, url: '/images/projets/717a146d-3c36-4a31-843e-56118152b957.png', isMain: true, isPreview: false },
      { id: 25, projet_id: 7, url: '/images/projets/4a76c971-aeba-407a-b8c7-bd67592e2008.png', isMain: true, isPreview: false }
    ];

    await db.Image.bulkCreate(images, { ignoreDuplicates: true });

    console.log("✅ Données insérées avec succès (Zone 83/06/04) !");
  } catch (error) {
    console.error("⚠️ Erreur lors de l'insertion des données :", error.message);
  }
}


// --- 4. MIDDLEWARES ---
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
// Protection au cas où le dossier n'existe pas
try {
  app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
} catch (e) { console.log("Info: Bootstrap non trouvé localement"); }

// --- 5. ROUTES ---
app.use('/api/utilisateurs', apiUtilisateursRouter);
app.use('/api/projets', apiProjetRouter);
app.use('/api/images', apiImageRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get('/api', (req, res) => {
  res.redirect('/api-docs');
});

// --- 6. GESTION ERREURS ---
app.use((req, res, next) => {
  if (req.accepts('json')) {
    res.status(404).json({ message: 'Route non trouvée' });
  } else {
    // Si tu n'as pas de vue 404.ejs, on envoie du texte simple
    res.status(404).send('404 - Page non trouvée');
  }
});

app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err);
  if (req.accepts('json')) {
    res.status(err.status || 500).json({ message: err.message || 'Erreur interne' });
  } else {
    // Fallback simple si error.ejs n'existe pas
    res.status(err.status || 500).send("Erreur serveur: " + err.message);
  }
});

// --- 7. DÉMARRAGE SÉQUENTIEL ---
const PORT = process.env.PORT || 3001;

initializeDatabase()
  .then(() => {
    console.log("🔄 Tentative de synchronisation des tables...");
    return db.sequelize.sync({ alter: true });
  })
  .then(async () => {
    // ON INSERE LES DONNEES ICI
    await seedDatabase();
    
    // ENSUITE ON LANCE LE SERVEUR
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur critique au démarrage :", err);
  });

module.exports = app;