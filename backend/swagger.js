
const swaggerAutogen = require('swagger-autogen')();
const fs = require('fs');
const doc = {
  info: {
    title: 'Api Credit agricole',
    description: 'Documentation générée automatiquement',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {

  const swaggerFile = require(outputFile);
  const paths = swaggerFile.paths;

  // On parcourt toutes les routes générées (ex: /api/articles/...)
  for (const path in paths) {

    // On découpe l'URL pour trouver le nom de la ressource
    // Ex: "/api/articles/12" -> on veut "Articles"
    const segments = path.split('/').filter(s => s !== ''); // Enlève les vides

    // On suppose que ta structure est api/nom_ressource/...
    // segments[0] = 'api', segments[1] = 'articles'
    let tag = 'Général';

    if (segments.length > 1 && segments[0] === 'api') {
      // On prend le 2ème segment (articles, messages, etc.)
      let resource = segments[1];

      // Petit bonus : Mettre la 1ère lettre en majuscule (articles -> Articles)
      tag = resource.charAt(0).toUpperCase() + resource.slice(1);
    }

    // On applique ce tag à toutes les méthodes (get, post, put, delete) de ce chemin
    const methods = paths[path];
    for (const method in methods) {
      // Si tu as déjà mis un tag manuel dans le code, on ne l'écrase pas (optionnel)
      if (!methods[method].tags || methods[method].tags.length === 0) {
        methods[method].tags = [tag];
      }
    }
  }

  // 3. On sauvegarde le fichier modifié
  fs.writeFileSync(outputFile, JSON.stringify(swaggerFile, null, 2));
  console.log('✅ Swagger généré et tags organisés automatiquement par URL !');
  require('./app.js'); // lance le serveur après la génération

});