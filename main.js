import { loadDetailView } from "./src/detailview";
import { renderStartScreen } from "./src/startscreen.js";

const body = document.getElementsByTagName("body");

renderStartScreen();

const favourite = document.querySelector(".favourite");

favourite.addEventListener("click", loadDetailView.bind(this, "Dunningen"));
