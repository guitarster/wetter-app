import { getForecastWeather } from "./API.js";
import { roundNumber } from "./utils.js";
import { loadBackgroundImage } from "./detailview.js";
import { loadDetailView } from "./detailview.js";
import { renderLoadScreen } from "./loadscreen.js";

const body = document.getElementsByTagName("body");

export function loadStartScreen() {
  renderLoadScreen("Lade Übersicht");

  renderStartScreen(getLocations());
}

function getLocations() {
  let location = JSON.parse(localStorage.getItem("favorites"));

  if (!location) {
    location = [];
  }

  return location;
}

async function renderfavorites(location) {
  let favoritesList = [];

  for (const element of location) {
    const favoriteHTML = await loadfavorite(element);
    favoritesList.push(favoriteHTML);
  }

  return favoritesList.join("");
}

async function renderStartScreen(location) {
  body[0].innerHTML = `
    <div id="app-start">
        <div class="headline">
            <div class="headline__title">Wetter</div>
            <span class="headline__edit">Bearbeiten</span>
        </div>
        <input id="test" class="searchfield" placeholder="Nach Stadt suchen..." />
        <div class="favorites">
          ${await renderfavorites(location)}
        </div>
    </div>
    `;

  renderFavoritesMessage();
  registerEventListener();
}

function renderFavoritesMessage() {
  const appStart = document.getElementById("app-start");

  if (!document.querySelector(".wrapper")) {
    appStart.innerHTML += `<span class="message-favorites" >Noch keine Favoriten gespeichert</span>`;
  }
}

async function loadfavorite(location) {
  const weatherData = await getForecastWeather(location);
  const backgroundImagePath = loadBackgroundImage(weatherData.current);

  return `
    <div id='${location}' class="wrapper">
      <div class="delete-button"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 12V17" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 12V17" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 7H20" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
      <div class="favorite" style="background-image: linear-gradient(0deg,#0003,#0003), url(${backgroundImagePath}); background-size: cover; background-position: center;">
        <div class="favorite__location">
          <span class="favorite__city">${weatherData.location.name}</span>
          <span class="favorite__country">${weatherData.location.country}</span>
        </div>
        <div class="favorite__temperature">${roundNumber(
          weatherData.current.temp_c
        )}°</div>
        <div class="favorite__condition">${
          weatherData.current.condition.text
        }</div>
        <div class="favorite__max-min-temp">
            <span class="favorite__max-temp">H: ${roundNumber(
              weatherData.forecast.forecastday[0].day.maxtemp_c
            )}°</span>
            <span class="favorite__min-temp">T: ${roundNumber(
              weatherData.forecast.forecastday[0].day.mintemp_c
            )}°</span>
        </div>
      </div>
    </div>`;
}

function displayDeleteButton() {
  const deleteButtonEl = document.querySelectorAll(".delete-button");
  const editBtnEl = document.querySelector(".headline__edit");

  if (document.querySelectorAll(".delete-button-display").length > 0) {
    deleteButtonEl.forEach((button) =>
      button.classList.remove("delete-button-display")
    );
    editBtnEl.innerHTML = `Bearbeiten`;
  } else {
    deleteButtonEl.forEach((button) =>
      button.classList.add("delete-button-display")
    );
    editBtnEl.innerHTML = `Fertig`;
  }

  const favoritesFromStorage = JSON.parse(localStorage.getItem("favorites"));

  if (favoritesFromStorage.length === 0) {
    editBtnEl.innerHTML = `Bearbeiten`;
  }
}

function removeFavorite(favoriteID) {
  let favoritesFromStorage = JSON.parse(localStorage.getItem("favorites"));

  favoritesFromStorage.splice(favoritesFromStorage.indexOf(favoriteID), 1);

  localStorage.setItem("favorites", JSON.stringify(favoritesFromStorage));

  document.getElementById(favoriteID).remove();

  renderFavoritesMessage();
}

function registerEventListener() {
  const favorites = document.querySelectorAll(".favorite");
  const editBtnEl = document.querySelector(".headline__edit");
  const deleteBtnsEl = document.querySelectorAll(".delete-button");

  favorites.forEach((favorite) => {
    favorite.addEventListener("click", () => {
      const favoriteID = favorite.closest(".wrapper").getAttribute("id");

      loadDetailView(favoriteID);
    });
  });

  editBtnEl.addEventListener("click", displayDeleteButton);

  deleteBtnsEl.forEach((button) => {
    button.addEventListener("click", () => {
      const favoriteID = button.closest(".wrapper").getAttribute("id");
      removeFavorite(favoriteID);
    });
  });
}
