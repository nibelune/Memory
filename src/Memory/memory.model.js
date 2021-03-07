import { readScores, createScore } from "./memory.api";

/**
 * Memory game model
 * @constructor
 * @param {Number} cardsInGame - number of cards to use.
 * @param {Number} duration - game duration in seconds.
 */
export default class MemoryModel {
  constructor(cardsInGame, duration) {
    this.deck = []; // the deck of cards
    this.selectedCards = [] // cards selected by player
    this.maxScore = cardsInGame; // maximum score
    this.score = 0; // current score
    this.startTime = 0; // time at begining of game
    this.elapsed = 0; // time elasped since begining of game
    this.duration = duration * 1000; // game duration in ms

    // populate deck
    for (let i = 1; i <= cardsInGame; i++) {
      this.deck.push(i);
    }

    // double deck
    this.deck = this.deck.concat(...this.deck);
  }

  // bindings
  bindTurnResolved(handler) { this.onTurnResolved = handler; }
  bindVictory(handler) { this.onVictory = handler; }
  bindTimeUpdate(handler) { this.onTimeUpdate = handler; }
  bindTimeout(handler) { this.onTimeout = handler; }

  /**
   * init/resest model
   */
  init() {
    this.shuffle();
    this.score = 0;
    this.startTime = new Date().getTime();
    this.elapsed = 0;
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 10);
  }

  /**
   * update timer and check timeout
   */
  updateTimer() {
    const now = new Date().getTime();
    this.elapsed = now - this.startTime;
    if (this.elapsed > this.duration) {
      clearInterval(this.timerInterval);
      this.onTimeout();
    } else {
      this.onTimeUpdate(this.elapsed, this.duration);
    }
  }

  /**
   * shuffle the deck
   */
  shuffle() {
    this.deck.sort(() => Math.random() - 0.5);
  }

  /**
   * return a copy of the deck
   */
  getDeck() {
    return [...this.deck];
  }

  /**
   * select a card from deck
   * @param {number} cardIndex - index of selected card
   */
  selectCard(cardIndex){
    this.selectedCards.push(cardIndex)
    if(this.selectedCards.length === 2){
      this.resolveTurn()
    }
  }

  /**
   * resolve a turn
   * @param {Array} playedCards - array containing the index of 2 cards
   */
  resolveTurn() {
    if (this.deck[this.selectedCards[0]] == this.deck[this.selectedCards[1]]) {
      this.score += 1;
      this.onTurnResolved({ match: true, cards: this.selectedCards });
      this.checkVictory();
    } else {
      this.onTurnResolved({ match: false, cards: this.selectedCards });
    }
    this.selectedCards = [];
  }

  /**
   * check victory
   */
  checkVictory() {
    if (this.score == this.maxScore) {
      clearInterval(this.timerInterval);
      createScore(parseInt(this.elapsed / 1000));
      this.onVictory(this.elapsed);
    }
  }

  /**
   * return highscores
   */
  async getHighScores() {
    const highscores = await readScores();
    return highscores;
  }
}
