/**
 * A card
 * @constructor
 * @param {Number} face - the face id of the card.
 */
export default class Card {
  constructor(face) {
    this.face = face;

    // create html elements
    this.cardElement = document.createElement("div");
    const cardFacesContainer = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");

    // set elements classes
    this.cardElement.classList.add("card");
    cardFacesContainer.classList.add("card-faces-container");
    front.classList.add("card-face-front", `card-face-${this.face}`);
    back.classList.add("card-face-back");

    // appends elements
    cardFacesContainer.appendChild(front);
    cardFacesContainer.appendChild(back);
    this.cardElement.append(cardFacesContainer);
  }

  /**
   * connect cardElement to the DOM
   * @param {elemet} element where to append the card
   */
  appendTo(element){
    element.appendChild(this.cardElement);
  }

  /**
   * check if the card is clickable
   * @returns {Boolean}
   */
  isClickable() {
    return (
      !this.cardElement.classList.contains("is-flipped") &&
      !this.cardElement.classList.contains("is-matched") &&
      this.cardElement.classList.contains("card")
    );
  }

  /**
   * show the card
   */
  flipIn() {
    this.cardElement.classList.add("is-flipped");
  }

  /**
   * hide the ard
   */
  flipOut() {
    this.cardElement.classList.remove("is-flipped");
  }
  
  /**
   * set a matched card
   */
  match() {
    this.cardElement.classList.add("is-matched");
  }
}
