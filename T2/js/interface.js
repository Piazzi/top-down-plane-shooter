import { Clock } from "../../build/three.module.js";
import Stats from "../../build/jsm/libs/stats.module.js";

const lifeInterface = document.getElementById("life");

export function removeHearts(num) {
  for (let i = 0; num != 0; i++) {
    if (lifeInterface.children[i].style.display != "none") {
      lifeInterface.children[i].style.display = "none";
      num--;
    }
  }
}

export function resetHearts() {
  for (let i = 0; i < lifeInterface.children.length; i++) {
    lifeInterface.children[i].style.display = "";
  }
}

// show clock time
setInterval(() => {
  clockText.innerText = clock.getElapsedTime().toFixed();
}, "1000");

export const stats = new Stats();
export var clock = new Clock(true);

let clockText = document.getElementById("clock");
let statsText = document.getElementById("stats");
stats.dom.style.top = "180px";
stats.dom.style.marginLeft = "20px";
statsText.appendChild(stats.dom);
