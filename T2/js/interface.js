import { Clock } from "../../build/three.module.js";
import Stats from "../../build/jsm/libs/stats.module.js";
import { playerLife } from "./player.js";

const lifeInterface = document.getElementById("life");
export const godMode = document.getElementById('god-mode');
export const resetGameMessage = document.getElementById('reset-game-message');

/**
 * Remove the num (parameter) of hearts from the interface
 * @param {int} num
 */
export function removeHearts(num) {
  for (let i = 0; num != 0; i++) {
    if (lifeInterface.children[i].style.display != "none") {
      lifeInterface.children[i].style.display = "none";
      num--;
    }
  }
}

export function addHearts(num) {

  for (let i = 0; num != 0; i++) {
    if (lifeInterface.children[i].style.display == "none") {
      num++;
      return lifeInterface.children[i].style.display = "";
    }
  }
}

/**
 * Reset hearts to its default state, 5 hearts.
 */
export function resetHearts() {
  for (let i = 0; i < lifeInterface.children.length; i++) {
    lifeInterface.children[i].style.display = "";
  }
}

export const stats = new Stats();
export var clock = new Clock(true);

let clockText = document.getElementById("clock");
// show clock time
setInterval(() => {
  clockText.innerText = clock.getElapsedTime().toFixed();
}, "1000");

let statsText = document.getElementById("stats");
stats.dom.style.top = "180px";
stats.dom.style.marginLeft = "20px";
statsText.appendChild(stats.dom);

