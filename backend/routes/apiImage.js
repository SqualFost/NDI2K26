const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Image = require('../models/Image');
const { verifierChamps } = require('./utils');
const fs = require('fs');

// 1. Définir le dossier de destination
const UPLOADS_FOLDER = path.join(__dirname, '../public/images/projets');

// 2. Logique de stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const newFileName = uuidv4() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});

// 3. Instance Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
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

// ROUTE POST
router.post('/image', upload.single('image'), async (req, res) => {
    /* 👇 LE BLOC SWAGGER DOIT ÊTRE ICI POUR FONCTIONNER AVEC MULTER 👇
    */
    /*
        #swagger.tags = ['Images']
        #swagger.auto = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['projet_id'] = { 
            in: 'formData', 
            type: 'integer', 
            required: true, 
            description: 'ID du projet lié' 
        }
        #swagger.parameters['isMain'] = { 
            in: 'formData', 
            type: 'boolean', 
            required: true, 
            description: 'Image principale ?' 
        }
        #swagger.parameters['isPreview'] = { 
            in: 'formData', 
            type: 'boolean', 
            required: true, 
            description: 'Preview ?' 
        }
        #swagger.parameters['image'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'Le fichier image à téléverser'
        }
    */

    // 1. Vérification immédiate du fichier
    if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier image fourni." });
    }

    try {
        // 2. Extraction des données
        let { projet_id, isMain, isPreview } = req.body;

        // Validation
        const erreurs = verifierChamps(req.body, ['projet_id', 'isMain', 'isPreview']);
        if (erreurs.length > 0) {
            throw new Error(`Champs manquants : ${erreurs.join(', ')}`);
        }

        // 3. Création en Base de Données
        const fileUrl = `/images/projets/${req.file.filename}`;

        const nouvelleImage = await Image.create({
            projet_id: parseInt(projet_id),
            url: fileUrl,
            // CORRECTION ICI : on utilise bien 'isMain' et 'isPreview'
            isMain: isMain === 'true' || isMain === true,       
            isPreview: isPreview === 'true' || isPreview === true 
        });

        // 4. Succès
        res.status(201).json({
            message: "Image téléchargée et liée avec succès.",
            url: fileUrl,
            data: nouvelleImage
        });

    } catch (error) {
        // Nettoyage en cas d'erreur
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Erreur suppression fichier:", err);
            });
        }
        console.error(error);
        const status = error.statusCode || 400;
        res.status(status).json({ message: error.message || "Erreur lors de l'upload" });
    }
});

router.delete('/deleteAllImage/:projet_id', async (req, res) => {
    
    try {
        const id = parseInt(req.params.projet_id, 10);
        await Image.destroy({
            where: { projet_id: id }
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;