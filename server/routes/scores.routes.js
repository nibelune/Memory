/**
 * Scores routes
 */

const router = require("express").Router();
const { scoresRead , scoreCreate } = require("../controllers/scores.controller");

//link routes to controller functions
router.get("/", scoresRead);
router.post("/", scoreCreate);

module.exports = router;
