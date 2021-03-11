/**
 * read scores from server
 */
const readScores = async () => {
  return fetch("/scores", {
    method: "GET"
  }).then(response => response.json()).then(data => data.map(score => score.score)).catch(error => {
    console.error(error);
  });
};
/**
 * submit new score to server
 * @param {number} score - the score to add
 */


const createScore = async score => {
  return fetch("/scores", {
    method: "POST",
    body: JSON.stringify({
      score
    }),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  }).catch(error => {
    console.error(error);
  });
};

var api = {
  readScores,
  createScore
};

/**
 * basic event emitter class
 * it simply allow to emit/register to events
 */
class EventEmitter {
  constructor() {
    this.events = {}; // object to store events
  }
  /**
   * Register to an event
   * @param {string} evt - event name
   * @param {function} listener - handler to call
   * @returns
   */


  on(evt, listener) {
    //logical OR returns the first "truthy" expression
    //if there is none, it returns the last expression
    (this.events[evt] || (this.events[evt] = [])).push(listener);
    return this;
  }
  /**
   * Emit an event
   * @param {string} evt - event name
   * @param  {...any} arg - arguments to pass to handler
   */


  emit(evt, ...arg) {
    (this.events[evt] || []).slice().forEach(listener => listener(...arg));
  }

}

/**
 * Memory game model
 * It emits 4 events: turnresolved, victory, timeupdate and timeout
 * @constructor
 * @param {Number} cardsPairs - number of differents cards to use.
 * @param {Number} duration - game duration in seconds.
 */

class MemoryModel extends EventEmitter {
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

    this.timerInterval = null; //timer interval reference
    // populate deck (each number correponds to a different card's face)

    for (let i = 1; i <= cardsPairs; i++) {
      this.deck.push(i);
    } // double deck


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
    if (!this.matchedCards.includes(cardIndex)) {
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
    let cardsMatch; //if the card face is the same on the 2 selected cards

    if (this.deck[this.selectedCards[0]] === this.deck[this.selectedCards[1]]) {
      this.score += 1;
      cardsMatch = true;
      this.matchedCards.push(this.selectedCards[0], this.selectedCards[1]);
      this.checkVictory();
    } else {
      cardsMatch = false;
    }

    this.emit("turnresolved", {
      cardsMatch,
      cards: this.selectedCards
    });
    this.selectedCards = [];
  }
  /**
   * check victory
   */


  async checkVictory() {
    if (this.score === this.victoryScore) {
      //stop timer
      clearInterval(this.timerInterval); //add sore to db

      await api.createScore(parseInt(this.elapsed / 1000)); //retrieve scores from db

      const highscores = await api.readScores();
      this.emit("victory", this.elapsed, highscores);
    }
  }

}

class Card {
  constructor(face, index) {
    this.face = face;
    this.index = index; // create html elements

    this.cardElement = document.createElement("div");
    const cardFacesContainer = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div"); // set elements classes

    this.cardElement.classList.add("card");
    cardFacesContainer.classList.add("card-faces-container");
    front.classList.add("card-face-front", `card-face-${this.face}`);
    back.classList.add("card-face-back"); // appends elements

    cardFacesContainer.appendChild(front);
    cardFacesContainer.appendChild(back);
    this.cardElement.append(cardFacesContainer);
  }

  appendTo(element) {
    element.appendChild(this.cardElement);
  }

  isClickable() {
    return !this.cardElement.classList.contains("is-flipped") && !this.cardElement.classList.contains("is-matched") && this.cardElement.classList.contains("card");
  }

  flipIn() {
    this.cardElement.classList.add("is-flipped");
  }

  flipOut() {
    this.cardElement.classList.remove("is-flipped");
  }

  match() {
    this.cardElement.classList.add("is-matched");
  }

}

class Timer {
  constructor() {
    this.progressBarElement = document.createElement("div");
    this.progressBarElement.classList.add("progress");
    this.timerElement = document.createElement("div");
    this.timerElement.classList.add("timer-container");
    this.timerElement.appendChild(this.progressBarElement);
  }

  appendTo(element) {
    element.appendChild(this.timerElement);
  }

  setProgress(percent) {
    this.progressBarElement.style.width = percent * 100 + "%";
  }

}

class Popup {
  constructor(content, callback) {
    this.callback = callback;
    console.log(callback);
    const popupElement = document.createElement("div");
    const contentElement = document.createElement("div");
    const closeBtnElement = document.createElement("div");
    popupElement.classList.add("popup");
    contentElement.classList.add("content");
    closeBtnElement.classList.add("close-btn");
    closeBtnElement.textContent = "Fermer";
    contentElement.appendChild(content);
    popupElement.appendChild(contentElement);
    popupElement.appendChild(closeBtnElement);
    closeBtnElement.addEventListener("click", evt => this.close(evt));
    document.body.appendChild(popupElement);
  }

  close(evt) {
    evt.target.parentElement.remove();

    if (this.callback) {
      this.callback();
      this.callback = null;
    }
  }

}

/**
 * Memory game view (DOM manipulations)
 * it emits 2 event:
 *   "cardselected" when player select a card
 *   "restartgame" when player close final popup
 *
 * @constructor
 * @param {HTMLElement} element - the html element where to append the memory game.
 */

class MemoryView extends EventEmitter {
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
    this.initCards(deck); //event delegation
    //https://javascript.info/event-delegation

    this.cardsContainer.onclick = evt => this.onCardClick(evt);
  }
  /**
   * init/reset cards
   * @param {array} deck - array containing cards
   */


  initCards(deck) {
    // remove existing cards
    this.cardsContainer.innerHTML = "";
    this.cards = []; //add new cards

    this.cards = [];
    deck.forEach(cardFace => {
      const card = new Card(cardFace);
      this.cards.push(card);
    });
    this.cards.forEach(card => card.appendTo(this.cardsContainer));
  }
  /**
   * builds highscores list
   * @returns {HTMLElement} highscorelist
   */


  buildHighscores(highscores) {
    const scoresList = document.createElement("ul");
    scoresList.classList.add("highscores"); // generate highscores list

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
    const clickedEl = evt.target; //check if it's a card or exit

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
      const playedCards = [this.cards[turn.cards[0]], this.cards[turn.cards[1]]];

      if (turn.cardsMatch) {
        playedCards.forEach(card => card.match());
      }

      playedCards.forEach(card => card.flipOut());
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
    this.openPopup("Vous avez perdu...", highscores, () => this.emit("restartgame"));
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

/**
 * Memory game controller
 * @constructor
 * @param {MemoryModel} model - the memory model.
 * @param {MemoryView} view - the memory view.
 */
class MemoryController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    /**
     * there is loads of ways to implement MVC. Here we are simply using events.
     * the model and the view both extend an EventEmitter class and emit events when required.
     * the controller simply listens for those events to call the corresponding handlers
     */
    // model events

    this.model.on("turnresolved", turn => this.onTurnResolved(turn));
    this.model.on("victory", (elapsed, highscores) => this.onVictory(elapsed, highscores));
    this.model.on("timeupdate", (elasped, duration) => this.onTimeUpdate(elasped, duration));
    this.model.on("timeout", highscores => this.onTimeout(highscores)); // view events

    this.view.on("cardselected", cardIndex => this.onCardSelected(cardIndex));
    this.view.on("restartgame", () => this.start());
  }
  /**
   * start a new game
   */


  start() {
    this.model.start();
    this.view.start(this.model.getDeck());
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

}

/**
 * A MVC memory game.
 * https://www.tomdalling.com/blog/software-design/model-view-controller-explained/
 * @constructor
 * @param {number} cardsInGame - the number of different cards to use (1-18).
 * @param {number} duration - the maximum duration of a game in seconds.
 * @param {HTMLElement} element - the html element where to append the memory game.
 */

class Memory {
  constructor(cardsInGame, duration, element) {
    this.app = new MemoryController(new MemoryModel(cardsInGame, duration), new MemoryView(element));
    this.app.start();
  }

}

//instanciate the game

new Memory(2, 10, document.querySelector("#app"));
