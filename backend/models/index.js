const sequelize = require('../config/db');

const Utilisateur = require('./Utilisateur');

module.exports = {
    sequelize,
    Utilisateur,
};