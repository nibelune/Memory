import "./scss/main.scss"; // import styles
import Memory from "./Memory"; // import Memory game 

//instanciate the game
const memory = new Memory(4, 120, document.querySelector("#app"));
