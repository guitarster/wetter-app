import { loadWeather } from "./detailview.js";
import { renderLoadScreen } from "./loadscreen.js";

const appEl = document.querySelector(".app-default");

const location = "New York";

renderLoadScreen(location);

display();

async function display() {
  const spinnerEl = document.querySelector(".lds-ring");
  const loadingMessage = document.querySelector(".loading__message");

  await loadWeather(location);

  spinnerEl.innerHTML = "";
  loadingMessage.innerHTML = "";
  appEl.classList.remove("app-default");
  appEl.classList.add("app");
}
