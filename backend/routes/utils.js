// utils/validation.js

/**
 * Vérifie la présence et la validité des champs dans un objet body.
 * @param {Object} body - Le req.body
 * @param {Array<string>} champs - La liste des noms de champs à vérifier
 * @returns {Array<string>} - La liste des champs en erreur
 */

// utils.js

const verifierChamps = (body, champs) => {
    let erreurs = [];
    champs.forEach(champ => {
        const valeur = body[champ];
        if (valeur === undefined || valeur === null || (typeof valeur === 'string' && valeur.trim() === '') || valeur == 'any') {
            erreurs.push(champ);
        }
    });
    return erreurs;
};


module.exports = { verifierChamps };