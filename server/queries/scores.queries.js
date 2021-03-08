/**
 * Queries for scores
 */

const Score = require('../database/models/score.model');

/**
 * query server to get and sort all scores
 */
exports.readScores = () => {
  return Score.find({}).sort({score:"asc"}).exec();
}

/**
 * query server to add a new score
 */
exports.createScore = (score) => {
  const newScore = new Score(score);
  return newScore.save();
}