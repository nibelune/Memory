import Popup from "./Popup";

/**
 * Memory game view (DOM manipulations)
 * 
 * @constructor
 * @param {HTMLElement} element - the html element where to append the memory game.
 */
export default class MemoryView {
  constructor(element) {
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
  bindGetHighScores(handler) { this.getHighScores = handler; }
  bindSelectCard(handler) { this.selectCard = handler; }
  bindRestartGame(handler) { this.restartGame = handler; }

  /**
   * init/reset view
   * @param {array} deck - array with the deck
   */
  init(deck) {
    this.playedCards = [];
    this.initCards(deck);
    this.CardsContainer.onclick = (evt) => this.onCardClick(evt);
  }

  /**
   * init/reset cards
   * @param {array} deck - array containing cards
   */
  initCards(deck) {
    // remove existing cards
    const previousCards = this.element.querySelectorAll(".card");
    previousCards.forEach((card) => card.remove());

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
  async buildHighscores() {
    const highscores = await this.getHighScores();
    const scoresList = document.createElement("ul");
    scoresList.classList.add("highscores");
    // generate highscores list
    highscores.forEach((score, index) => {
      const item = document.createElement("li");
      item.innerHTML = `<strong>${index + 1}</strong> ${score}`;
      scoresList.appendChild(item);
    });
    
    return scoresList
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
      this.selectCard(this.getCardIndex(clickedEl));
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
  onVictory(elapsed) {
    setTimeout(async () => {
      const container = document.createElement("div");
      const scoresList = await this.buildHighscores()
      container.innerHTML = `<p>Vous avez gagné en <br>${
        parseInt(elapsed / 1000)
      } secondes</p>`;
      container.appendChild(scoresList);
      //create popup
      new Popup(container, this.restartGame);
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
    new Popup(container, this.restartGame);
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
