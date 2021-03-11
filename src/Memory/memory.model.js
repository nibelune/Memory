import api from "./memory.api";
import EventEmitter from "../utils/EventEmitter";

/**
 * Memory game model
 * It emits 4 events: turnresolved, victory, timeupdate and timeout
 * @constructor
 * @param {Number} cardsPairs - number of differents cards to use.
 * @param {Number} duration - game duration in seconds.
 */
export default class MemoryModel extends EventEmitter {
  constructor(cardsPairs, duration) {
    super();

    this.deck = []; // the deck of cards
    this.selectedCards = []; // cards selected by player
    this.matchedCards = []; // cards allready matched
    this.victoryScore = cardsPairs; // maximum score
    this.score = 0; // current score
    this.startTime = 0; // time at begining of game
    this.elapsed = 0; // time elasped since begining of game
    this.duration = duration * 1000; // game duration in ms
    this.timerInterval = null //timer interval reference

    // populate deck (each number correponds to a different card's face)
    for (let i = 1; i <= cardsPairs; i++) {
      this.deck.push(i);
    }

    // double deck
    this.deck = this.deck.concat(...this.deck);
  }

  /**
   * init/resest model
   */
   start() {
    this.shuffleDeck();
    this.score = 0;
    this.selectedCards = [];
    this.matchedCards = [];
    this.startTime = new Date().getTime();
    this.elapsed = 0;
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 20);
  }

  /**
   * update timer and check timeout
   */
  async updateTimer() {
    const now = new Date().getTime();
    this.elapsed = now - this.startTime;
    if (this.elapsed > this.duration) {
      clearInterval(this.timerInterval);
      const highscores = await api.readScores();
      this.emit("timeout", highscores);
    } else {
      this.emit("timeupdate", this.elapsed, this.duration);
    }
  }

  /**
   * shuffle the deck
   */
  shuffleDeck() {
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
    if (!this.matchedCards.includes(cardIndex)){
      this.selectedCards.push(cardIndex);
      if (this.selectedCards.length === 2) {
        this.resolveTurn();
      }
    }
  }

  /**
   * resolve a turn
   */
  resolveTurn() {
    let cardsMatch;
    //if the card face is the same on the 2 selected cards
    if (this.deck[this.selectedCards[0]] === this.deck[this.selectedCards[1]]) {
      this.score += 1;
      cardsMatch = true;
      this.matchedCards.push (this.selectedCards[0],this.selectedCards[1]);
      this.checkVictory();
    } else {
      cardsMatch = false;
    }
    this.emit("turnresolved", { cardsMatch, cards: this.selectedCards });
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
      await api.createScore(parseInt(this.elapsed / 1000));
      //retrieve scores from db
      const highscores = await api.readScores();
      this.emit("victory", this.elapsed, highscores);
    }
  }
}
