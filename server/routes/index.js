/**
 * Main router
 */

const router = require("express").Router();
const scores = require("./scores.routes"); //get scores routes

router.use("/scores", scores); //add scores routes to /scores

router.get("/", (req, res) => { //serve index template when accessing root
  res.render("index");
});

module.exports = router;