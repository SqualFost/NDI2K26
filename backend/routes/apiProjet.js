const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet'); 
const { Op } = require('sequelize');
const { verifierChamps } = require('./utils');


// ---------------------
// Ajouter un Projet
// ---------------------
router.post('/', async (req, res) => {
  try {
    const { nom, description, longitude, latitude, utilisateur_id, date_debut  } = req.body;
    const champsRequis = ['nom', 'description', 'longitude', 'latitude', 'utilisateur_id', 'date_debut' ];

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
        date_debut
    });

    res.status(201).json(projet);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Liste de tous les personnnes
// ---------------------
router.get('/', async (req, res) => {
  try {
    const projets = await Projet.findAll();
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

    const projet = await Projet.findByPk(id);
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });

    res.json(projet);
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

    const { nom, description, longitude, latitude, utilisateur_id, date_debut  } = req.body;
    const champsRequis = ['nom', 'description', 'longitude', 'latitude', 'utilisateur_id', 'date_debut' ];


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
      date_debut
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