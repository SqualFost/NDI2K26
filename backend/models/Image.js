
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // 👈 bien le fichier de config

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    projet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Projet',
            key: 'id',
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isMain: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isPreview: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }

}, {
    tableName: 'Image', // correspond au nom de la table MySQL existante
    timestamps: false, // désactiver createdAt / updatedAt si ta table n’en a pas
});

module.exports = Image;