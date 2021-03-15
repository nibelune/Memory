# Memory

Malbouffe, stress, abus en tout genre, Alzheimer nous guette tous ! Fais travailler ta mémoire !

## technos 

 - Front : html / css / js  
 - Back : node / express / mongoDB / pug  

## Comment ça fonctionne ?

### Le front

app.js initialise le jeu (on peut changer le nombres de cartes ou la durée d'une partie pour faciliter les tests)

Le jeu repose sur une architechture MVC
  - le modéle a en charge la gestion de l'état, la logique du jeu et la communication avec l'API
  - la vue constitue l'interface avec laquelle le joueur interagit
  - le controlleur permet la communication entre le modèle et la vue

### Le back

Le back repose également sur une architecture de type MVC. Il utilise Express, d'une part pour servir la page html du jeu, générée à partir d'un template (pug) et d'autre part exposer une api pour interagir avec la base de données.

Le serveur reçoit une requête. En fonction de la route appelée et du verbe http utilisé le routeur invoque la fonction correspondante du controleur. Cette derniére traite la demande et renvoie la réponse adéquate.

L'utilisation de mongoose permet de facilement valider les données (contrairement aux tables des bases SQL qui disposent de champs typés, le contenu des documents de mongoDB est dénormalisé, il est donc préférable de créer des schémas en amont)

## installation

1. récupération des modules utilisés 
```
npm install
```
2. Configuration de la base de données dans le fichier server/environment.js
```javascript
dbUrl: "mongodb://mongo:27017/memory?retryWrites=true",
```
3. Démarrage du serveur 
```
npm run start
```
## Docker

Il est également possible de tester l'application en utilisant Docker
```
docker-compose up --build
```
Après construction de l'image le jeu est accessible sur http://localhost

## Pistes d'améliorations

- demander son nom au joueur afin de l'associer à son score
- gestion des erreurs
- refactoriser en utilisant des web components
- tests

### Remarques

Au départ je ne savais pas trop quelle voie prendre... un memory... c'est simple... mmh... c'est louche...

Alors je me suis imaginé ça comme un support de cours sur MVC, destiné à des apprenants qui connaissent déjà JS coté front et back. Typiquement un cours pour un développeur fullstack JS.  
Je n'ai pas utilisé JQuery parce que j'appécie que le client pèse 6ko.
