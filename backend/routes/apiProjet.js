const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');
// 👇 AJOUT 1 : Il faut importer le modèle Image pour faire la liaison
const Image = require('../models/Image'); 
const { Op } = require('sequelize');
const { verifierChamps } = require('./utils');


// ---------------------
// Ajouter un Projet
// ---------------------
router.post('/', async (req, res) => {
  try {
    const { nom, description, longitude, latitude, utilisateur_id, date_debut ,budget,categorie,localisation  } = req.body;
    const champsRequis = ['nom', 'description', 'longitude', 'latitude', 'utilisateur_id', 'date_debut' ,'budget','categorie','localisation' ];

    const erreurs = verifierChamps(req.body, champsRequis);

    if (erreurs.length > 0) {
      return res.status(400).json({
        message: "Certains champs sont manquants ou invalides",
        champsManquants: erreurs
      });
    }
    
    const projet = await Projet.create({
        nom,
        description,
        longitude,
        latitude,
        utilisateur_id,
        date_debut,
        budget,
        categorie,
        localisation
    });

    res.status(201).json(projet);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Liste de tous les projets (AVEC IMAGES)
// ---------------------
router.get('/', async (req, res) => {
  try {
    const projets = await Projet.findAll({
        // 👇 AJOUT 2 : C'est ici qu'on inclut les images de force
        include: Image 
        // Si tu avais défini un alias dans tes modèles (ex: as: 'illustrations'), 
        // il faudrait mettre : include: { model: Image, as: 'illustrations' }
    });
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Obtenir un projet par ID
// ---------------------
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    // Tu peux aussi le faire ici si tu veux voir les images dans le détail d'un projet
    const projet = await Projet.findByPk(id, { include: Image }); 
    
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });

    res.json(projet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id/images', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const projet = await Projet.findByPk(id);
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });
    const images = await projet.getImages();

    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Modifier un projet
// ---------------------
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const { nom, description, longitude, latitude, utilisateur_id, date_debut ,budget,categorie,localisation  } = req.body;
    const champsRequis = ['nom', 'description', 'longitude', 'latitude', 'utilisateur_id', 'date_debut' ,'budget','categorie','localisation' ];

    const erreurs = verifierChamps(req.body, champsRequis);

    if (erreurs.length > 0) {
      return res.status(400).json({
        message: "Certains champs sont manquants ou invalides",
        champsManquants: erreurs
      });
    }
    const projet = await Projet.findByPk(id);
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });

    await projet.update({
      nom,
      description,
      longitude,
      latitude,
      utilisateur_id,
      date_debut,
      budget,
      categorie,
      localisation,
    });

    res.json(projet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Supprimer un projet
// ---------------------
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const projet = await Projet.findByPk(id);
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });

    await projet.destroy();
    res.status(204).send(); // Pas de contenu
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;