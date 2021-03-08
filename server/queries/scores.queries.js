/**
 * Queries for scores
 */

const Score = require('../database/models/score.model');

/**
 * query db to get all sorted scores
 */
exports.readScores = () => {
  return Score.find({}).sort({score:"asc"}).exec();
}

/**
 * query db to add a new score
 */
exports.createScore = (score) => {
  const newScore = new Score(score);
  return newScore.save();
}