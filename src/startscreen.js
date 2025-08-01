import { getForecastWeather } from "./API.js";
import { roundNumber } from "./utils.js";
import { loadBackgroundImage } from "./detailview.js";
//import { loadDetailView } from "./detailview.js";

const body = document.getElementsByTagName("body");

//let eventListeners = [];

export async function loadStartScreen(location) {
  renderStartScreen();

  location.forEach((element) => {
    renderFavourite(element);
  });

  // setEventListeners(location);
}

/*function setEventListeners(location) {
  location.forEach((element) => {
    const favourite = document.getElementById(element);
    console.log(favourite);
    eventListeners.push(
      favourite.addEventListener("click", loadDetailView.bind(this, element))
    );
  });
} */

async function renderFavourite(location) {
  const weatherData = await getForecastWeather(location);
  const favouritesEl = document.querySelector(".favourites");
  const backgroundImagePath = loadBackgroundImage(weatherData.current);
  favouritesEl.innerHTML += `
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
    `;
}

function renderStartScreen() {
  body[0].innerHTML = `
    <div id="app-start">
        <div class="headline">
            <div class="headline__title">Wetter</div>
            <a href="" class="headline__edit">Bearbeiten</a>
        </div>
        <input id="test" class="searchfield" placeholder="Nach Stadt suchen..." />
        <div class="favourites"></div>
    </div>
    `;
}
