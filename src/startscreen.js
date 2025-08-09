import { getForecastWeather, getSuggestions } from "./API.js";
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
        <div class="wrapper-search-field">
          <input type="text" id="search-field" placeholder="Nach Stadt suchen..." />
          <div id="locations" class="hide"></div>
        </div>
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
    appStart.innerHTML += `<div class="message-favorites" >Noch keine Favoriten gespeichert</div>`;
    registerEventListener();
  }
}

async function loadfavorite(location) {
  const weatherData = await getForecastWeather(location);
  const backgroundImagePath = loadBackgroundImage(weatherData.current);

  return `
    <div id='${location}' data-id="${
    weatherData.location.name
  }" class="wrapper">
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

  if (editBtnEl.innerHTML === "Bearbeiten") {
    deleteButtonEl.forEach((button) =>
      button.classList.add("delete-button-display")
    );
    editBtnEl.innerHTML = "Fertig";
  } else {
    deleteButtonEl.forEach((button) =>
      button.classList.remove("delete-button-display")
    );
    editBtnEl.innerHTML = "Bearbeiten";
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
  const inputBox = document.getElementById("search-field");

  favorites.forEach((favorite) => {
    favorite.addEventListener("click", () => {
      const favoriteID = favorite.closest(".wrapper").getAttribute("id");
      const favoriteDataID = favorite
        .closest(".wrapper")
        .getAttribute("data-id");

      loadDetailView(favoriteID, favoriteDataID);
    });
  });

  editBtnEl.addEventListener("click", displayDeleteButton);

  deleteBtnsEl.forEach((button) => {
    button.addEventListener("click", () => {
      const favoriteID = button.closest(".wrapper").getAttribute("id");
      removeFavorite(favoriteID);
    });
  });

  inputBox.addEventListener("input", loadAfterTimeout);
}

let timer;

function loadAfterTimeout(inputBox) {
  clearTimeout(timer);

  timer = setTimeout(() => {
    loadLocation(inputBox);
  }, 500);
}

function loadLocation(inputBox) {
  let inputBoxOldVal = "";
  let newVal = inputBox.target.value.trim();

  if (newVal && newVal !== inputBoxOldVal) {
    inputBoxOldVal = newVal;
    clearSuggestions();
    loadPlaceholder();
    registerEventListenerAppClick();
    registerEventListenerSearchfieldSelect();
    getSuggestions(newVal, onMatchingData);
  } else if (!newVal) {
    inputBoxOldVal = "";
    clearSuggestions();
  }
}

function addHideClass() {
  const locationsListDiv = document.getElementById("locations");

  locationsListDiv.classList.add("hide");
}

function clearSuggestions() {
  const locationsListDiv = document.getElementById("locations");
  locationsListDiv.innerHTML = "";
  addHideClass();
}

function loadPlaceholder() {
  const locationsListDiv = document.getElementById("locations");

  locationsListDiv.classList.remove("hide");

  locationsListDiv.innerHTML = `<div class="item">Lade Vorschläge...</div>`;
}

function registerEventListenerAppClick() {
  document.addEventListener("click", function (event) {
    const wrapperSearchField = document.querySelector(".wrapper-search-field");

    if (wrapperSearchField.contains(event.target)) {
      return;
    }

    addHideClass();
  });
}

function registerEventListenerSearchfieldSelect() {
  const searchfield = document.getElementById("search-field");
  const locationsListDiv = document.getElementById("locations");

  searchfield.addEventListener("focusin", () => {
    locationsListDiv.classList.remove("hide");
  });
}

function onMatchingData(suggestions) {
  const locationsListDiv = document.getElementById("locations");
  let locations = "";

  suggestions.forEach((location) => {
    locations += `<div id=${location.id} data-id="${location.name}" class="item">
                    <p class="item__name">${location.name}</p>
                    <p class="item__country">${location.country}</p>
                  </div>`;
  });

  locationsListDiv.innerHTML = locations;

  if (suggestions.length > 0) {
    locationsListDiv.classList.remove("hide");
  }

  const items = document.querySelectorAll(".item");

  for (let item of items) {
    const id = item.getAttribute("id");
    const dataId = item.getAttribute("data-id");
    item.addEventListener("click", function () {
      loadDetailView(id, dataId);
    });
  }
}
