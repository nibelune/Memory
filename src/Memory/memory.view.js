import EventEmitter from "../utils/EventEmitter";
import Card from "./components/Card";
import Timer from "./components/Timer";
import Popup from "./components/Popup";

/**
 * Memory game view (DOM manipulations)
 * it emits 2 event:
 *   "cardselected" when player select a card
 *   "restartgame" when player close final popup
 *
 * @constructor
 * @param {HTMLElement} element - the html element where to append the memory game.
 */
export default class MemoryView extends EventEmitter {
  constructor(element) {
    super();

    this.element = element; // html container
    this.cards = []; // Cards objects

    // create cards container element
    this.cardsContainer = document.createElement("div");
    this.cardsContainer.classList.add("board");
    this.element.appendChild(this.cardsContainer);

    this.timer = new Timer();
    this.timer.appendTo(this.element);
  }

  /**
   * init/reset view
   * @param {array} deck - array with the deck
   */
  start(deck) {
    this.initCards(deck);
    //event delegation
    //https://javascript.info/event-delegation
    this.cardsContainer.onclick = (evt) => this.onCardClick(evt);
  }

  /**
   * init/reset cards
   * @param {array} deck - array containing cards
   */
  initCards(deck) {
    // remove existing cards
    this.cardsContainer.innerHTML = "";
    this.cards = [];

    //add new cards
    this.cards = [];
    deck.forEach((cardFace) => {
      const card = new Card(cardFace);
      this.cards.push(card);
    });
    this.cards.forEach((card) => card.appendTo(this.cardsContainer));
  }

  /**
   * builds highscores list
   * @returns {HTMLElement} highscorelist
   */
  buildHighscores(highscores) {
    const scoresList = document.createElement("ul");
    scoresList.classList.add("highscores");
    // generate highscores list
    highscores.forEach((score, index) => {
      const item = document.createElement("li");
      item.innerHTML = `<strong>${index + 1}</strong> ${score}`;
      scoresList.appendChild(item);
    });

    return scoresList;
  }

  /**
   * handler for click
   * @param {MouseEvent} evt - event object
   */
  onCardClick(evt) {
    //get clicked element
    const clickedEl = evt.target;

    //check if it's a card or exit
    if (!clickedEl.classList.contains("card")) return;

    const clickedCard = this.cards[this.getCardIndex(clickedEl)];
    if (clickedCard.isClickable()) {
      clickedCard.flipIn();
      this.emit("cardselected", this.getCardIndex(clickedEl));
    }
  }

  /**
   * handler for time update
   * @param {Number} elapsed - elapsed time
   * @param {Number} duration - game duration
   */
  onTimeUpdate(elapsed, duration) {
    this.timer.setProgress(elapsed / duration);
  }

  /**
   * Update cards visibility
   * @param {Object} turn - An object with 2 properties
   *                        match (Boolean) true if the 2 cards match, otherwise false
   *                        cards (Array) indexex of the played cards
   */
  onTurnResolved(turn) {
    setTimeout(() => {
      const playedCards = [
        this.cards[turn.cards[0]],
        this.cards[turn.cards[1]],
      ];
      if (turn.cardsMatch) {
        playedCards.forEach((card) => card.match());
      }
      playedCards.forEach((card) => card.flipOut());
    }, 500);
  }

  /**
   * handler for victory
   * @param {Number} elapsed - time elapsed before victory
   */
  onVictory(elapsed, highscores) {
    //remove click event handler
    this.cardsContainer.onclick = null;

    setTimeout(() => {
      const msg = `Vous avez gagné en <br>${parseInt(elapsed / 1000)} secondes`;
      this.openPopup(msg, highscores, () => this.emit("restartgame"));
    }, 500);
  }

  /**
   * handler for timeout
   */
  onTimeout(highscores) {
    this.timer.setProgress(1);
    this.cardsContainer.onclick = null;

    this.openPopup("Vous avez perdu...", highscores, () =>
      this.emit("restartgame")
    );
  }

  /**
   * open a popup
   * @param {String} msg
   * @param {Array} highscores
   * @param {Function} callback
   */
  openPopup(msg, highscores, callback) {
    const scoresList = this.buildHighscores(highscores);
    const popupContent = document.createElement("div");
    popupContent.innerHTML = `<p>${msg}</p>`;
    popupContent.appendChild(scoresList);
    new Popup(popupContent, () => callback());
  }

  /**
   * get index of a card
   * @param {HTMLElement} card - card
   * @returns {number} - index of the card
   */
  getCardIndex(card) {
    return [...this.cardsContainer.querySelectorAll(".card")].indexOf(card);
  }
}
