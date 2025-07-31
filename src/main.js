import { loadApp } from "./detailview.js";
import { renderLoadScreen } from "./loadscreen.js";
import { renderStartScreen } from "./startscreen.js";

const body = document.getElementsByTagName("body");

renderStartScreen();

const location = document.getElementById(1).innerHTML;
const favourite = document.querySelector(".favourite");

favourite.addEventListener("click", displayDetailView);

function displayDetailView() {
  renderLoadScreen(location);

  loadApp(location);
}
