/**
 * Scores routes
 */

const router = require("express").Router();
const { scoresList , scoreAdd } = require("../controllers/scores.controller");

//link routes to controller functions
router.get("/", scoresList);
router.post("/", scoreAdd);

module.exports = router;
