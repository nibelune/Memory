# Memory

Malbouffe, stress, abus en tout genre, Alzheimer nous guette tous ! Fais travailler ta mémoire !

## technos 

Front : html / css / js  
Back : node / express / mongoDB / pug  

### Comment ça fonctionne ?

Le serveur sert la page du jeu (template pug) et expose une petite api sur la route /scores  

  GET /scores renvoie la liste des scores  
  POST /scores permet d'ajouter un score

Côté front, la page charge le javascript client et la feuille de style du jeu.  

## Le front

Le jeu repose sur une architechture MVC
  - le modéle a en charge la gestion de l'état, la logique du jeu et la communication avec l'API
  - la vue constitue l'interface avec laquelle le joueur interagit
  - le controlleur permet la communication entre le modèle et la vue  

### installation

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

