
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // 👈 bien le fichier de config

const Projet = sequelize.define('Projet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude : {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  latitude : {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  utilisateur_id :{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Utilisateur',
      key: 'id',
    }
  },
  date_debut : {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  budget : {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  categorie : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localisation : {
    type: DataTypes.STRING,
    allowNull: false,
  },

  
  
}, {
  tableName: 'Projet', // correspond au nom de la table MySQL existante
  timestamps: false, // désactiver createdAt / updatedAt si ta table n’en a pas
});

module.exports = Projet;