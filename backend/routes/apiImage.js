
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Image = require('../models/Image');
const { verifierChamps, verifierLogique } = require('./utils');
const fs = require('fs'); // Nécessaire pour supprimer le fichier en cas d'erreur


// 1. Définir le dossier de destination pour le stockage
const UPLOADS_FOLDER = path.join(__dirname, '../public/images/projets');


// 2. Définir la logique de stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Le dossier où stocker les images
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        // Renommer le fichier pour éviter les collisions (UUID + extension originale)
        const newFileName = uuidv4() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});

// 3. Créer l'instance Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite la taille à 5MB (ajustez si besoin)
    },
    fileFilter: (req, file, cb) => {
        // Filtrer les types de fichiers (accepter uniquement les images)
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées.'), false);
        }
    }
});


router.get('/', async (req, res) => {
    try {
        const image = await Image.findAll();
        res.json(image);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/image', upload.single('image'), async (req, res) => {
    /*
        #swagger.tags = ['Upload']
        #swagger.auto = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['article_id'] = { in: 'formData', type: 'integer', required: true, description: 'ID de l\'article' }
        #swagger.parameters['estPrincipal'] = { in: 'formData', type: 'boolean', required: true, description: 'Image principale ?' }
        #swagger.parameters['image'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'Le fichier image à téléverser (max 5MB).'
        }
    */

    // 1. Vérification immédiate du fichier
    if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier image fourni." });
    }

    try {
        // 2. Extraction et Parsing (Multer transforme tout en string dans req.body)
        let { article_id, estPrincipal } = req.body;

        // Validation des champs requis
        const erreurs = verifierChamps(req.body, ['article_id', 'estPrincipal']);
        if (erreurs.length > 0) {
            throw new Error(`Champs manquants : ${erreurs.join(', ')}`); // On lance une erreur pour aller au catch
        }

        // // 3. Vérification de l'article
        // const articleExiste = await Article.findByPk(article_id);
        // if (!articleExiste) {
        //     // L'article n'existe pas, c'est une erreur client (404)
        //     // MAIS le fichier est déjà sur le disque, il faut le supprimer !
        //     const error = new Error("L'article n'existe pas");
        //     error.statusCode = 404;
        //     throw error;
        // }

        // 4. Création en Base de Données
        const fileUrl = `/images/projets/${req.file.filename}`;

        const nouvelleImage = await Image.create({
            article_id: parseInt(article_id),     // Assurer le type Int
            url: fileUrl,                         // Le champ s'appelle 'url' dans votre modèle
            est_principale: estPrincipal === 'true' || estPrincipal === true, // Gestion du booléen reçu en string
            est_preview: false
        });

        // 5. Succès
        res.status(201).json({
            message: "Image téléchargée et liée avec succès.",
            url: fileUrl,
            data: nouvelleImage
        });

    } catch (error) {
        // GESTION DES ERREURS (Nettoyage)
        // Si quoi que ce soit échoue (validation, DB, etc.), on supprime le fichier uploadé
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Erreur lors de la suppression du fichier orphelin:", err);
            });
        }

        console.error(error);
        const status = error.statusCode || 400; // 400 par défaut car souvent erreur de validation
        res.status(status).json({ message: error.message || "Erreur lors de l'upload" });
    }
});

router.delete('/deleteAllImage/:article_id', async (req, res) => {
    try {
        const id = parseInt(req.params.article_id, 10);
        await Image.destroy({
            where: {
                article_id: id
            }
        });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;