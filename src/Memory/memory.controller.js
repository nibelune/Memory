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

    // model events
    this.model.on("turnresolved", (turn) => this.onTurnResolved(turn));
    this.model.on("victory", (elapsed, highscores) => this.onVictory(elapsed, highscores));
    this.model.on("timeupdate", (elasped, duration) => this.onTimeUpdate(elasped, duration));
    this.model.on("timeout", (highscores) => this.onTimeout(highscores));

    // view events
    this.view.on("cardselected", (cardIndex) => this.onCardSelected(cardIndex));
    this.view.on("restartgame", () => this.start());
  }

  /**
   * notify view of turn resolution
   * @param {Array} turn - an array of objects {match:{Boolean}, cards:{Array}}
   */
  onTurnResolved(turn) {
    this.view.onTurnResolved(turn);
  }

  /**
   * notify view of victory
   * @param {number} elapsed - duration of the game in seconds
   */
  onVictory(elapsed, highscores) {
    this.view.onVictory(elapsed, highscores);
  }

  /**
   * notify view of timeout
   */
  onTimeout(highscores) {
    this.view.onTimeout(highscores);
  }

  /**
   * notify view of time update
   * @param {number} elapsed - duration of the game in ms
   * @param {number} duration - max duration of the game in ms
   */
  onTimeUpdate(elasped, duration) {
    this.view.onTimeUpdate(elasped, duration);
  }

  /**
   * notify model of card selection
   * @param {number} cardIndex - index of the selected card
   */
  onCardSelected(cardIndex) {
    this.model.selectCard(cardIndex);
  }

  /**
   * return a copy of the deck
   */
  getDeck() {
    return this.model.getDeck();
  }

  /**
   * start a new game
   */
  start() {
    console.log ("start")
    this.model.init();
    this.view.init(this.model.getDeck());
  }
}
