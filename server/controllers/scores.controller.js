/**
 * Controller for scores routes
 */

const { readScores, createScore } = require("../queries/scores.queries");

/**
 * get all scores
 */
exports.scoresRead = async (req, res, next) => {
  try {
    const scores = await readScores();
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

/**
 * add new score
 */
exports.scoreCreate = async (req, res, next) => {
  try {
    await createScore(req.body);
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};
