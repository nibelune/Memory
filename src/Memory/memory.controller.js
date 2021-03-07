/**
 * Memory game controller
 * @constructor
 * @param {MemoryModel} model - the memory model.
 * @param {MemoryView} view - the memory view.
 */

export default class MemoryController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // model bindings
    this.model.bindTurnResolved((turn) => this.onTurnResolved(turn));
    this.model.bindVictory((elapsed) => this.onVictory(elapsed));
    this.model.bindTimeout(() => this.onTimeout());
    this.model.bindTimeUpdate((elasped, duration) => this.onTimeUpdate(elasped, duration));

    // view bindings
    this.view.bindSelectCard((cardIndex) => this.selectCard(cardIndex));
    this.view.bindRestartGame(() => this.start());
    this.view.bindGetHighScores(() => this.getHighscores())
  }

  /**
   * signal and pass turn resolution to view
   * @param {Array} turn - an array with the index of the two mismatching cards
   */
  onTurnResolved(turn) {
    this.view.onTurnResolved(turn);
  }

  /**
   * signal victory and pass time elapsed to view
   * @param {number} elapsed - duration of the game in seconds
   */
  onVictory(elapsed) {
    this.view.onVictory(elapsed);
  }

  /**
   * signal end of time to the view
   */
  onTimeout() {
    this.view.onTimeout();
  }

  /**
   * signal timer update to the view
   * @param {number} elapsed - duration of the game in ms
   * @param {number} duration - max duration of the game in ms
   */
  onTimeUpdate(elasped, duration) {
    this.view.onTimeUpdate(elasped, duration);
  }

  /**
   * signal and pass played cards to the model
   * @param {array} cardsIndexes - indexes of the two played cards
   */
   selectCard(cardIndex) {
    this.model.selectCard(cardIndex);
  }

  /**
   * return a shuffled array with all cards id, ie the board
   */
  getDeck() {
    return this.model.getDeck();
  }

  /**
   * return highscores
   */
   getHighscores() {
    return this.model.getHighScores();
  }

  /**
   * start a new game
   */
  start() {
    this.model.init();
    this.view.init(this.model.getDeck());
  }
}
