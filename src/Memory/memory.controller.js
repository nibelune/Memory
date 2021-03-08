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
    this.model.on("turnresolved", (turn) => this.onTurnResolved(turn));
    this.model.on("victory", (elapsed, highscores) => this.onVictory(elapsed, highscores));
    this.model.on("timeupdate", (elasped, duration) =>
      this.onTimeUpdate(elasped, duration)
    );
    this.model.on("timeout", () => this.onTimeout());

    // view bindings
    this.view.on("cardselected", (cardIndex) => this.selectCard(cardIndex));
    this.view.on("restartgame", () => this.start());
  }

  /**
   * signal and pass turn resolution to view
   * @param {Array} turn - an array with the index of the two mismatching cards
   */
  onTurnResolved(turn) {
    console.log("onTurnResolved");
    this.view.onTurnResolved(turn);
  }

  /**
   * signal victory and pass time elapsed to view
   * @param {number} elapsed - duration of the game in seconds
   */
  onVictory(elapsed, highscores) {
    this.view.onVictory(elapsed, highscores);
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
    console.log("onTimeUpdate");
    this.view.onTimeUpdate(elasped, duration);
  }

  /**
   * signal and pass played cards to the model
   * @param {array} cardsIndexes - indexes of the two played cards
   */
  selectCard(cardIndex) {
    console.log("selectCard");
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
