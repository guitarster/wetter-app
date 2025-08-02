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
  let location = JSON.parse(localStorage.getItem("favourites"));

  if (!location) {
    location = [];
  }

  return location;
}

async function renderFavourites(location) {
  let favouritesList = [];

  for (const element of location) {
    const favouriteHTML = await loadFavourite(element);
    favouritesList.push(favouriteHTML);
  }

  return favouritesList.join("");
}

async function renderStartScreen(location) {
  body[0].innerHTML = `
    <div id="app-start">
        <div class="headline">
            <div class="headline__title">Wetter</div>
            <span class="headline__edit">Bearbeiten</span>
        </div>
        <input id="test" class="searchfield" placeholder="Nach Stadt suchen..." />
        <div class="favourites">
          ${await renderFavourites(location)}
        </div>
    </div>
    `;

  registerEventListener();
}

async function loadFavourite(location) {
  const weatherData = await getForecastWeather(location);
  const backgroundImagePath = loadBackgroundImage(weatherData.current);

  return `
    <div class="wrapper">
      <div class="delete-button">Delete</div>
      <div class="favourite" id='${location}' style="background-image: linear-gradient(0deg,#0003,#0003), url(${backgroundImagePath}); background-size: cover; background-position: center;">
        <div class="favourite__location">
          <span class="favourite__city">${weatherData.location.name}</span>
          <span class="favourite__country">${
            weatherData.location.country
          }</span>
        </div>
        <div class="favourite__temperature">${roundNumber(
          weatherData.current.temp_c
        )}°</div>
        <div class="favourite__condition">${
          weatherData.current.condition.text
        }</div>
        <div class="favourite__max-min-temp">
            <span class="favourite__max-temp">H: ${roundNumber(
              weatherData.forecast.forecastday[0].day.maxtemp_c
            )}°</span>
            <span class="favourite__min-temp">T: ${roundNumber(
              weatherData.forecast.forecastday[0].day.mintemp_c
            )}°</span>
        </div>
      </div>
    </div>`;
}

function displayDeleteButton() {
  const deleteButtonEl = document.querySelectorAll(".delete-button");

  if (document.querySelectorAll(".delete-button-display").length > 0) {
    deleteButtonEl.forEach((button) =>
      button.classList.remove("delete-button-display")
    );
  } else {
    deleteButtonEl.forEach((button) =>
      button.classList.add("delete-button-display")
    );
  }
}

function registerEventListener() {
  const favourites = document.querySelectorAll(".favourite");
  const editBtnEl = document.querySelector(".headline__edit");

  favourites.forEach((favourite) => {
    favourite.addEventListener("click", () => {
      const favouriteID = favourite.getAttribute("id");

      loadDetailView(favouriteID);
    });
  });

  editBtnEl.addEventListener("click", displayDeleteButton);
}
