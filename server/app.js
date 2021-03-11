/**
 * server bootstrap
 */

const express = require('express');
const morgan = require('morgan'); // log, usefull for debug
const path = require('path'); // resolves paths
const index = require('./routes'); // server routes
const errorHandler = require('errorhandler'); // show errors on front (not to be used in production)
require('./database'); // db connection

const app = express();
const port = process.env.PORT || 3000;

// set templates directory and engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add express middlewares
app.use(morgan('short')); // use morgan for logs
app.use(express.static(path.join(__dirname, '/public'))); // serve static assets
app.use(express.json()); // gives access to req.body 
app.use(index); // set routing

// add errorHandler middleware in dev only
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    const code = err.code || 500;
    res.status(code).json({
      code: code,
      message: code === 500 ? null : err.message
    });
  })
}

// start server
app.listen(port, () => {
  console.log(`memory game is ready on http://localhost:${port}`)
});

