import MemoryModel from "./memory.model";
import MemoryView from "./memory.view";
import MemoryController from "./memory.controller";

/**
 * A MVC memory game.
 * https://www.tomdalling.com/blog/software-design/model-view-controller-explained/
 * @constructor
 * @param {number} cardsInGame - the number of different cards to use (1-18).
 * @param {number} duration - the maximum duration of a game in seconds.
 * @param {HTMLElement} element - the html element where to append the memory game.
 */

export default class Memory {
  constructor(cardsInGame, duration, element) {
    this.app = new MemoryController(
      new MemoryModel(cardsInGame, duration),
      new MemoryView(element)
    );
    this.app.start();
  }
}
