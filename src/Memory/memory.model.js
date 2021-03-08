import API from "./memory.api";
import EventEmitter from "../utils/EventEmitter";
/**
 * Memory game model
 * It emits 4 events: turnresolved, victory, timeupdate and timeout
 * @constructor
 * @param {Number} cardsInGame - number of cards to use.
 * @param {Number} duration - game duration in seconds.
 */
export default class MemoryModel extends EventEmitter {
  constructor(cardsInGame, duration) {
    super();
    this.deck = []; // the deck of cards
    this.selectedCards = []; // cards selected by player
    this.victoryScore = cardsInGame; // maximum score
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
  async updateTimer() {
    const now = new Date().getTime();
    this.elapsed = now - this.startTime;
    if (this.elapsed > this.duration) {
      clearInterval(this.timerInterval);
      const highscores = await API.readScores();
      this.emit("timeout", highscores);
    } else {
      this.emit("timeupdate", this.elapsed, this.duration);
    }
  }

  /**
   * shuffle the deck
   */
  shuffle() {
    // this is a quick and dirty shuffle, for something more effective look at Fisher–Yates Shuffle
    // https://bost.ocks.org/mike/shuffle/
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
  selectCard(cardIndex) {
    this.selectedCards.push(cardIndex);
    if (this.selectedCards.length === 2) {
      this.resolveTurn();
    }
  }

  /**
   * resolve a turn
   */
  resolveTurn() {
    let match;
    if (this.deck[this.selectedCards[0]] == this.deck[this.selectedCards[1]]) {
      this.score += 1;
      match = true;
      this.checkVictory();
    } else {
      match = false;
    }
    this.emit("turnresolved", { match, cards: this.selectedCards });
    this.selectedCards = [];
  }

  /**
   * check victory
   */
  async checkVictory() {
    if (this.score === this.victoryScore) {
      //stop timer
      clearInterval(this.timerInterval);
      //add sore to db
      await API.createScore(parseInt(this.elapsed / 1000));
      //retrieve scores from db
      const highscores = await API.readScores();
      this.emit("victory", this.elapsed, highscores);
    }
  }
}
