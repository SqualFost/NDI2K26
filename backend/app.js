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

    // 1. UTILISATEURS
    const utilisateurs = [
      { id: 1, nom: 'Admin', prenom: 'Fondation CA', adresse: 'Draguignan', dob: '1990-01-01', mot_de_passe: 'admin2025', role: 'ADMIN' },
      { id: 2, nom: 'Assoc', prenom: 'Chant des Dauphins', adresse: 'Port-Fréjus', dob: '2000-06-15', mot_de_passe: 'mer83', role: 'USER' },
      { id: 3, nom: 'Assoc', prenom: 'Recyclerie Gare', adresse: 'Hyères', dob: '2015-03-10', mot_de_passe: 'velo83', role: 'USER' },
      { id: 4, nom: 'Assoc', prenom: 'AVATH', adresse: 'Toulon', dob: '1998-09-22', mot_de_passe: 'miam83', role: 'USER' },
      { id: 5, nom: 'Musée', prenom: 'Dinosaures', adresse: 'Fox-Amphoux', dob: '2025-06-07', mot_de_passe: 'raptor83', role: 'USER' }
    ];
    // ignoreDuplicates: true évite de planter si l'ID 1 existe déjà
    await db.Utilisateur.bulkCreate(utilisateurs, { ignoreDuplicates: true });

    // 2. PROJETS
    const projets = [
      { id: 1, nom: 'Voile Bonheur', longitude: 6.733, latitude: 43.433, description: 'Sorties en mer pour public handicapé (autisme) à la rencontre des dauphins.', utilisateur_id: 2, date_debut: '2025-05-01', budget: 5000, categorie: 'Social', localisation: 'Port-Fréjus' },
      { id: 2, nom: 'Atelier Vélo Solidaire', longitude: 5.435, latitude: 43.124, description: 'Équipement pour réparation de vélos et formation de salariés en insertion.', utilisateur_id: 3, date_debut: '2025-02-15', budget: 2500, categorie: 'Environnement', localisation: 'Hyères' },
      { id: 3, nom: 'Comptoir Bistrot Chalucet', longitude: 5.927, latitude: 43.124, description: 'Restauration solidaire et inclusive pour lutter contre la précarité alimentaire.', utilisateur_id: 4, date_debut: '2025-10-01', budget: 3200, categorie: 'Social', localisation: 'Toulon' },
      { id: 4, nom: 'Musée Dinosaures', longitude: 6.100, latitude: 43.580, description: 'Ouverture du musée sur site paléontologique majeur.', utilisateur_id: 5, date_debut: '2025-06-07', budget: 7000, categorie: 'Culture', localisation: 'Fox-Amphoux' },
      { id: 5, nom: 'Randonnée Éco-Trail', longitude: 6.146, latitude: 43.610, description: 'Organisation de randonnées guidées pour sensibiliser à l’écologie.', utilisateur_id: 2, date_debut: '2025-03-12', budget: 1800, categorie: 'Environnement', localisation: 'Marseille' },
      { id: 6, nom: 'Jardin Partagé Toulonnais', longitude: 5.930, latitude: 43.125, description: 'Création d’un jardin partagé pour les habitants de Toulon.', utilisateur_id: 4, date_debut: '2025-04-20', budget: 1200, categorie: 'Social', localisation: 'Toulon' },
      { id: 7, nom: 'Atelier Peinture Nice', longitude: 7.260, latitude: 43.710, description: 'Cours de peinture inclusifs pour enfants et adultes.', utilisateur_id: 3, date_debut: '2025-06-05', budget: 2000, categorie: 'Culture', localisation: 'Nice' },
      { id: 8, nom: 'Nettoyage Plage Cannes', longitude: 7.010, latitude: 43.552, description: 'Mobilisation citoyenne pour nettoyer les plages de Cannes.', utilisateur_id: 2, date_debut: '2025-07-10', budget: 1500, categorie: 'Environnement', localisation: 'Cannes' },
      { id: 9, nom: 'Bistrot Solidaire Marseille', longitude: 5.370, latitude: 43.300, description: 'Repas gratuits et activités pour les personnes précaires.', utilisateur_id: 4, date_debut: '2025-08-15', budget: 3500, categorie: 'Social', localisation: 'Marseille' },
      { id: 10, nom: 'Musée du Patrimoine Menton', longitude: 7.500, latitude: 43.780, description: 'Expositions temporaires pour valoriser le patrimoine local.', utilisateur_id: 5, date_debut: '2025-05-30', budget: 6000, categorie: 'Culture', localisation: 'Menton' },
      { id: 11, nom: 'Atelier Cirque Saint-Raphaël', longitude: 6.740, latitude: 43.430, description: 'Cours de cirque pour enfants et adolescents.', utilisateur_id: 3, date_debut: '2025-09-01', budget: 2200, categorie: 'Culture', localisation: 'Saint-Raphaël' },
      { id: 12, nom: 'Festival du Livre Hyères', longitude: 6.140, latitude: 43.120, description: 'Organisation d’un festival du livre et d’ateliers d’écriture.', utilisateur_id: 3, date_debut: '2025-10-12', budget: 3000, categorie: 'Culture', localisation: 'Hyères' },
      { id: 13, nom: 'Randonnée Seniors Provence', longitude: 6.050, latitude: 43.220, description: 'Activités de plein air pour les seniors.', utilisateur_id: 2, date_debut: '2025-03-20', budget: 1000, categorie: 'Social', localisation: 'Draguignan' },
      { id: 14, nom: 'Éco-Cyclo Nice', longitude: 7.280, latitude: 43.710, description: 'Ateliers de réparation de vélos pour promouvoir la mobilité durable.', utilisateur_id: 3, date_debut: '2025-04-18', budget: 1800, categorie: 'Environnement', localisation: 'Nice' },
      { id: 15, nom: 'Théâtre Inclusif Marseille', longitude: 5.370, latitude: 43.295, description: 'Cours de théâtre pour personnes en situation de handicap.', utilisateur_id: 4, date_debut: '2025-06-25', budget: 2500, categorie: 'Culture', localisation: 'Marseille' },
      { id: 16, nom: 'Atelier Cuisine Solidaire Toulon', longitude: 5.930, latitude: 43.125, description: 'Cours de cuisine pour apprendre à cuisiner avec peu de ressources.', utilisateur_id: 4, date_debut: '2025-05-10', budget: 2000, categorie: 'Social', localisation: 'Toulon' },
      { id: 17, nom: 'Observatoire des Oiseaux Camargue', longitude: 4.650, latitude: 43.550, description: 'Activités d’observation et protection des oiseaux.', utilisateur_id: 2, date_debut: '2025-07-05', budget: 2200, categorie: 'Environnement', localisation: 'Camargue' },
      { id: 18, nom: 'Festival Jazz Nice', longitude: 7.270, latitude: 43.705, description: 'Organisation d’un festival de jazz et concerts gratuits.', utilisateur_id: 5, date_debut: '2025-08-20', budget: 4000, categorie: 'Culture', localisation: 'Nice' },
      { id: 19, nom: 'Nettoyage Parc National Esterel', longitude: 6.780, latitude: 43.420, description: 'Opération de nettoyage et sensibilisation écologique.', utilisateur_id: 2, date_debut: '2025-09-10', budget: 1300, categorie: 'Environnement', localisation: 'Fréjus' },
      { id: 20, nom: 'Club Lecture Hyères', longitude: 6.140, latitude: 43.120, description: 'Club de lecture pour adolescents et jeunes adultes.', utilisateur_id: 3, date_debut: '2025-10-01', budget: 900, categorie: 'Culture', localisation: 'Hyères' },
      { id: 21, nom: 'Récup’ Vélos Marseille', longitude: 5.370, latitude: 43.300, description: 'Collecte et réparation de vélos pour les étudiants et familles.', utilisateur_id: 3, date_debut: '2025-03-15', budget: 2000, categorie: 'Environnement', localisation: 'Marseille' },
      { id: 22, nom: 'Danse Inclusive Cannes', longitude: 7.010, latitude: 43.552, description: 'Cours de danse pour tous publics, incluant personnes handicapées.', utilisateur_id: 4, date_debut: '2025-05-12', budget: 1800, categorie: 'Culture', localisation: 'Cannes' },
      { id: 23, nom: 'Bibliothèque Mobile Provence', longitude: 6.050, latitude: 43.220, description: 'Création d’une bibliothèque mobile pour les zones rurales.', utilisateur_id: 5, date_debut: '2025-06-08', budget: 2500, categorie: 'Culture', localisation: 'Draguignan' },
      { id: 24, nom: 'Atelier Jardinage Menton', longitude: 7.500, latitude: 43.780, description: 'Cours de jardinage pour enfants et familles.', utilisateur_id: 2, date_debut: '2025-07-15', budget: 1500, categorie: 'Environnement', localisation: 'Menton' }
    ];
    await db.Projet.bulkCreate(projets, { ignoreDuplicates: true });

    // 3. IMAGES
    const images = [
      { id: 1, url: 'https://cdn/voile_handicap.jpg', projet_id: 1, isMain: true, isPreview: true },
      { id: 2, url: 'https://cdn/dauphins.jpg', projet_id: 1, isMain: false, isPreview: false },
      { id: 3, url: 'https://cdn/atelier_velo.jpg', projet_id: 2, isMain: true, isPreview: true },
      { id: 4, url: 'https://cdn/bistrot_devanture.jpg', projet_id: 3, isMain: true, isPreview: true },
      { id: 5, url: 'https://cdn/cuisine_inclusive.jpg', projet_id: 3, isMain: false, isPreview: true },
      { id: 6, url: 'https://cdn/raptor_museum.jpg', projet_id: 4, isMain: true, isPreview: true },
      { id: 7, url: 'https://cdn/inauguration.jpg', projet_id: 4, isMain: false, isPreview: false },
      // Nouveaux
      { id: 8, url: 'https://cdn/randonnee_ecotrail.jpg', projet_id: 5, isMain: true, isPreview: true },
      { id: 9, url: 'https://cdn/jardin_partage.jpg', projet_id: 6, isMain: true, isPreview: true },
      { id: 10, url: 'https://cdn/atelier_peinture.jpg', projet_id: 7, isMain: true, isPreview: true },
      { id: 11, url: 'https://cdn/nettoyage_plage.jpg', projet_id: 8, isMain: true, isPreview: true },
      { id: 12, url: 'https://cdn/bistrot_solidaire.jpg', projet_id: 9, isMain: true, isPreview: true },
      { id: 13, url: 'https://cdn/musee_menton.jpg', projet_id: 10, isMain: true, isPreview: true },
      { id: 14, url: 'https://cdn/atelier_cirque.jpg', projet_id: 11, isMain: true, isPreview: true },
      { id: 15, url: 'https://cdn/festival_livre.jpg', projet_id: 12, isMain: true, isPreview: true }
    ];
    await db.Image.bulkCreate(images, { ignoreDuplicates: true });

    console.log("✅ Données insérées avec succès (ou déjà présentes) !");
  } catch (error) {
    console.error("⚠️ Erreur lors de l'insertion des données :", error.message);
    // On ne throw pas l'erreur pour ne pas bloquer le démarrage du serveur si c'est juste un détail
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