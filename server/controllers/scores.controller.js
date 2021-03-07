/**
 * Controller for scores routes
 */

const { listScores, addScore } = require("../queries/scores.queries");

/**
 * get all scores
 */
exports.scoresList = async (req, res, next) => {
  try {
    const scores = await listScores();
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

/**
 * add new score
 */
exports.scoreAdd = async (req, res, next) => {
  try {
    await addScore(req.body);
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};
