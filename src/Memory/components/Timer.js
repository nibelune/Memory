/**
 * a timer progressBar
 */
export default class Timer {
  constructor() {
    this.progressBarElement = document.createElement("div");
    this.progressBarElement.classList.add("progress");

    this.timerElement = document.createElement("div");
    this.timerElement.classList.add("timer-container");
    this.timerElement.appendChild(this.progressBarElement);
  }
  
  /**
   * connect timerElement to the DOM
   * @param {elemet} element where to append the card
   */
  appendTo(element){
    element.appendChild(this.timerElement);
  }

  /**
   * Set progress bar width
   * @param {Number} percent 
   */
  setProgress(percent) {
    this.progressBarElement.style.width = percent * 100 + "%";
  }
}
