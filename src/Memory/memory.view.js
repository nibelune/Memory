import EventEmitter from "../utils/EventEmitter";
import Popup from "./Popup";

/**
 * Memory game view (DOM manipulations)
 * it emits 2 event: 
 *   "cardselected" when player select a card
 *   "restartgame" when player close end of game popup
 * 
 * @constructor
 * @param {HTMLElement} element - the html element where to append the memory game.
 */
export default class MemoryView extends EventEmitter {
  constructor(element) {
    super();

    this.element = element; //html container

    //create cards container element
    this.CardsContainer = document.createElement("div");
    this.CardsContainer.classList.add("board");
    this.element.appendChild(this.CardsContainer);

    //create timer elements
    this.progressBar = document.createElement("div");
    this.progressBar.classList.add("progress");
    const timer = document.createElement("div");
    timer.classList.add("timer-container");
    timer.appendChild(this.progressBar);
    this.element.appendChild(timer);
  }

  //bindings
  bindGetHighScores(handler) {
    this.getHighScores = handler;
  }

  /**
   * init/reset view
   * @param {array} deck - array with the deck
   */
  init(deck) {
    this.playedCards = [];
    this.initCards(deck);
    //event delegation
    //https://javascript.info/event-delegation
    this.CardsContainer.onclick = (evt) => this.onCardClick(evt);
  }

  /**
   * init/reset cards
   * @param {array} deck - array containing cards
   */
  initCards(deck) {
    // remove existing cards
    this.CardsContainer.innerHTML = "";

    //add new cards
    deck.forEach((cardId) => {
      const card = this.buildCard(cardId);
      this.CardsContainer.appendChild(card);
    });
  }

  /**
   * builds a card
   * @param {Number} cardId - id of the face of the card
   * @returns {HTMLElement} a card
   */
  buildCard(cardId) {
    // create html elements
    const card = document.createElement("div");
    const cardFacesContainer = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");

    // set elements classes
    card.classList.add("card");
    cardFacesContainer.classList.add("card-faces-container");
    front.classList.add("card-face-front", `card-face-${cardId}`);
    back.classList.add("card-face-back");

    // appends elements
    cardFacesContainer.appendChild(front);
    cardFacesContainer.appendChild(back);
    card.append(cardFacesContainer);

    return card;
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
    // if element is a clickable card
    if (
      !clickedEl.classList.contains("is-flipped") &&
      !clickedEl.classList.contains("is-matched") &&
      clickedEl.classList.contains("card")
    ) {
      // flip the card
      clickedEl.classList.add("is-flipped");
      this.emit("cardselected", this.getCardIndex(clickedEl));
    }
  }

  /**
   * handler for time update
   * @param {Number} elapsed - elapsed time
   * @param {Number} duration - game duration
   */
  onTimeUpdate(elapsed, duration) {
    this.progressBar.style.width = `${(elapsed / duration) * 100}%`;
  }

  /**
   * Update cards visibility
   * @param {Object} turn - An object with 2 properties
   *                        match (Boolean) true if the 2 cards match, otherwise false
   *                        cards (Array) indexex of the played cards
   */
  onTurnResolved(turn) {
    setTimeout(() => {
      const cardA = this.getCardByIndex(turn.cards[0]);
      const cardB = this.getCardByIndex(turn.cards[1]);
      if (turn.match) {
        cardA.classList.add("is-matched");
        cardB.classList.add("is-matched");
      }
      cardA.classList.remove("is-flipped");
      cardB.classList.remove("is-flipped");
    }, 500);
  }

  /**
   * handler for victory
   * @param {Number} elapsed - time elapsed before victory
   */
  onVictory(elapsed, highscores) {
    setTimeout(() => {
      const container = document.createElement("div");
      const scoresList = this.buildHighscores(highscores);
      container.innerHTML = `<p>Vous avez gagné en <br>${parseInt(
        elapsed / 1000
      )} secondes</p>`;
      container.appendChild(scoresList);
      //create popup
      new Popup(container, () => this.emit("restartgame"));
    }, 500);
  }

  /**
   * handler for timeout
   */
  onTimeout() {
    //set timer progress bar width
    const progressElement = this.element.querySelector(".progress");
    progressElement.style.width = "100%";

    //remove click event handler
    this.CardsContainer.onclick = null;

    const container = document.createElement("p");
    container.innerHTML = "vous avez perdu";
    new Popup(container, () => this.emit("restartgame"));
  }

  /**
   * get a card according to its index
   * @param {index} index - index of the card
   * @returns {HTMLElement}
   */
  getCardByIndex(index) {
    return this.CardsContainer.querySelectorAll(".card")[index];
  }

  /**
   * get index of a specific card
   * @param {HTMLElement} card - card
   * @returns {number} - index of the card
   */
  getCardIndex(card) {
    return [...this.CardsContainer.querySelectorAll(".card")].indexOf(card);
  }
}
