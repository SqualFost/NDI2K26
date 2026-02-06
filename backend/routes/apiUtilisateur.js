const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur'); 
const { Op } = require('sequelize');
const { verifierChamps } = require('./utils');


// ---------------------
// Ajouter un Utilisateur
// ---------------------
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, adresse, dob, phone, email, mot_de_passe,role } = req.body;
    const champsRequis = ['nom', 'prenom', 'adresse', 'dob', 'phone', 'email', 'mot_de_passe','role'];

    const erreurs = verifierChamps(req.body, champsRequis);

    if (erreurs.length > 0) {
      return res.status(400).json({
        message: "Certains champs sont manquants ou invalides",
        champsManquants: erreurs
      });
    }
    
    const utilisateur = await Utilisateur.create({
      nom,
      prenom,
      adresse,
      dob,
      phone,
      email,
      mot_de_passe,
      role
    });

    res.status(201).json(utilisateur);
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
    const utilisateurs = await Utilisateur.findAll();
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ---------------------
// Obtenir un utilisateur par ID
// ---------------------
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id/projets', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const projets = await utilisateur.getProjets();

    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// Modifier un utilisateur
// ---------------------
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });
    const { nom, prenom, adresse, dob, phone, email, mot_de_passe ,role} = req.body;

    const champsRequis = ['nom', 'prenom', 'adresse', 'dob', 'phone', 'email', 'mot_de_passe','role'];

    const erreurs = verifierChamps(req.body, champsRequis);

    if (erreurs.length > 0) {
      return res.status(400).json({
        message: "Certains champs sont manquants ou invalides",
        champsManquants: erreurs
      });
    }
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    await utilisateur.update({
      nom,
      prenom,
      adresse,
      dob,
      phone,
      email,
      mot_de_passe,
      role
    });

    res.json(utilisateur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// Supprimer un utilisateur
// ---------------------
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    await utilisateur.destroy();
    res.status(204).send(); // Pas de contenu
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;