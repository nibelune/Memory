/**
 * Queries for scores
 */

const Score = require('../database/models/score.model');

/**
 * query db to retrieve all scores
 */
exports.listScores = () => {
  return Score.find({}).exec();
}

/**
 * query db to add a new score
 */
exports.addScore = (score) => {
  const newScore = new Score(score);
  return newScore.save();
}