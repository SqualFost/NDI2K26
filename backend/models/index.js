const sequelize = require('../config/db');

const Utilisateur = require('./Utilisateur');
const Projet = require('./Projet');
const Image = require('./Image');

Utilisateur.hasMany(Projet, { foreignKey: 'utilisateur_id' });
Projet.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Projet.hasMany(Image, { foreignKey: 'projet_id' });
Image.belongsTo(Projet, { foreignKey: 'projet_id' });


module.exports = {
    sequelize,
    Utilisateur,
    Projet,
    Image
};