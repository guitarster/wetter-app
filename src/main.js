import { loadWeather } from "./detailview.js";
import { renderLoadScreen } from "./loadscreen.js";

const appEl = document.querySelector(".app-default");

const location = "Dunningen";

renderLoadScreen(location);

display();

async function display() {
  await loadWeather(location);

  const appEl = document.querySelector(".app-default");
  const spinnerEl = document.querySelector(".lds-ring");
  const loadingMessage = document.querySelector(".loading__message");

  spinnerEl.innerHTML = "";
  loadingMessage.innerHTML = "";

  appEl.classList.remove("app-default");
  appEl.classList.add("app");
}
