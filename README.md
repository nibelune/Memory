# Memory

Malbouffe, stress, abus en tout genre, Alzheimer nous guette tous ! Fais travailler ta mémoire !

## technos 

Front : html / css / js  
Back : node / express / mongoDB / pug  

## Comment ça fonctionne ?

### Le front

Le jeu repose sur une architechture MVC
  - le modéle a en charge la gestion de l'état, la logique du jeu et la communication avec l'API
  - la vue constitue l'interface avec laquelle le joueur interagit
  - le controlleur permet la communication entre le modèle et la vue

### Le Back

Le back respose également sur une architecture de type MVC. Il utilise sur express, d'une part pour servir la page html du jeu, générée à partir d'un template (pug) et d'autre part exposer une api pour lire la liste des scores et ajouter un nouveau score.

Le serveur reçoit une requête. En fonction de la route appelée et du verbe http utilisé le routeur invoque la fonction correspondante du controleur. Cette derniére traite la demande et renvoie la réponse adéquate.

L'utilisation de mongoose permet de facilement valider les données (contrairement aux tables des bases SQL qui disposent de champs typés, le contenu des documents de mongoDB est dénormalisé, il est donc préférable de créer des schémas en amont)

## installation

1. récupération des modules utilisés 
```
npm install
```
2. Configuration de la base de données dans le fichier server/environment.js
```javascript
dbUrl: "mongodb://localhost:27017/memory?retryWrites=true&w=majority",
```
2. Démarrage du serveur 
```
npm run start
```

## Pistes d'améliorations

- demander son nom à l'utilisataur afin de l'associer à son score
- gestion des erreurs
- tests