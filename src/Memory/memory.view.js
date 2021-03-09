import EventEmitter from "../utils/EventEmitter";
import Popup from "./Popup";

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

    this.element = element; //html container

    //create cards container element
    this.cardsContainer = document.createElement("div");
    this.cardsContainer.classList.add("board");
    this.element.appendChild(this.cardsContainer);

    //create timer elements
    this.progressBar = document.createElement("div");
    this.progressBar.classList.add("progress");
    const timer = document.createElement("div");
    timer.classList.add("timer-container");
    timer.appendChild(this.progressBar);
    this.element.appendChild(timer);
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
    this.cardsContainer.onclick = (evt) => this.onCardClick(evt);
  }

  /**
   * init/reset cards
   * @param {array} deck - array containing cards
   */
  initCards(deck) {
    // remove existing cards
    this.cardsContainer.innerHTML = "";

    //add new cards
    const cards = []
    deck.forEach((cardId) => {
      cards.push(this.buildCard(cardId));
      this.cardsContainer.append(...cards);
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
      const cards = [
        this.getCardByIndex(turn.cards[0]),
        this.getCardByIndex(turn.cards[1]),
      ];
      if (turn.match) {
        cards.forEach((card) => card.classList.add("is-matched"));
      }
      cards.forEach((card) => card.classList.remove("is-flipped"));
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
      const scoresList = this.buildHighscores(highscores);
      const container = document.createElement("div");
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
  onTimeout(highscores) {
    //set timer progress bar width
    const progressElement = this.element.querySelector(".progress");
    progressElement.style.width = "100%";

    //remove click event handler
    this.cardsContainer.onclick = null;

    const scoresList = this.buildHighscores(highscores);
    const container = document.createElement("div");
    container.innerHTML = "<p>vous avez perdu</p>";
    container.appendChild(scoresList)
    new Popup(container, () => this.emit("restartgame"));
  }

  /**
   * get a card according to its index
   * @param {index} index - index of the card
   * @returns {HTMLElement}
   */
  getCardByIndex(index) {
    return this.cardsContainer.querySelectorAll(".card")[index];
  }

  /**
   * get index of a specific card
   * @param {HTMLElement} card - card
   * @returns {number} - index of the card
   */
  getCardIndex(card) {
    return [...this.cardsContainer.querySelectorAll(".card")].indexOf(card);
  }
}
