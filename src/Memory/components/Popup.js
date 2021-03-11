/**
 * a basic popup
 * @param {HTMLElement} content - the content of the popup
 * @param {Function} callback - function to call poup is closed
 */
export default class Popup {
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

    closeBtnElement.addEventListener("click", (evt) => this.close(evt));

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
