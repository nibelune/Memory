/**
 * score model
 */

const mongoose = require('mongoose');

/**
 * score Schema, a score doument is just a number
 */
const scoreSchema = mongoose.Schema({
  score: { type: Number, required: true },
});

const Score = mongoose.model('score', scoreSchema);

module.exports = Score;