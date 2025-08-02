import { getForecastWeather } from "./API.js";
import {
  roundNumber,
  formatHourlyTime,
  splitTime,
  splitTimePM,
} from "./utils.js";
import { getConditionImagePath } from "./conditions.js";
import { renderLoadScreen } from "./loadscreen.js";
import { loadStartScreen } from "./startscreen.js";

const body = document.getElementsByTagName("body");
let app = "";

export function loadDetailView(location) {
  renderLoadScreen(`Lade Wetter für ${location}`);
  loadWeather(location);
}

async function loadWeather(location) {
  const forecastWeather = await getForecastWeather(location);
  const currentDay = forecastWeather.forecast.forecastday[0];
  const current = forecastWeather.current;

  renderApp();
  app = document.getElementById("app-detailview");

  const imagePath = loadBackgroundImage(current);

  renderBackgroundImage(imagePath);

  renderNavBar();

  loadCurrentWeather(forecastWeather, currentDay);

  loadForecastHourlyTitle(currentDay);

  loadForecastHourlyForecasts(forecastWeather, currentDay);

  loadForecastDaysForecasts(forecastWeather);

  loadMiniStats(current, currentDay);

  registerEventListener();
}

function loadCurrentWeather(forecastWeather, currentDay) {
  const locationName = forecastWeather.location.name;
  const temperature = forecastWeather.current.temp_c;
  const conditionText = forecastWeather.current.condition.text;
  const maxTemperature = currentDay.day.maxtemp_c;
  const minTemperature = currentDay.day.mintemp_c;

  renderCurrentWeather(
    locationName,
    roundNumber(temperature),
    conditionText,
    roundNumber(maxTemperature),
    roundNumber(minTemperature)
  );
}

function loadForecastHourlyTitle(currentDay) {
  const conditionForecastText = currentDay.day.condition.text;
  const maxWindForecast = currentDay.day.maxwind_kph;
  renderForecastHourlyTitle(conditionForecastText, maxWindForecast);
}

function loadForecastHourlyForecasts(forecastWeather, currentDay) {
  const forecastHours = currentDay.hour;
  const forecastHoursNextDay = forecastWeather.forecast.forecastday[1].hour;

  const currentTime = formatHourlyTime(forecastWeather.current.last_updated);

  let counterCurrentDay = 0;

  for (let element of forecastHours) {
    const forecastHour = formatHourlyTime(element.time);
    const forecastTemperature = element.temp_c;
    const forecastIcon = element.condition.icon;

    if (forecastHour === currentTime) {
      counterCurrentDay++;
      renderForecastHourlyForecasts(
        "Jetzt",
        forecastIcon,
        roundNumber(forecastTemperature)
      );
    } else if (forecastHour >= currentTime) {
      counterCurrentDay++;
      renderForecastHourlyForecasts(
        forecastHour + " Uhr",
        forecastIcon,
        roundNumber(forecastTemperature)
      );
    }
  }

  let counterNextDay = 0;

  for (let el of forecastHoursNextDay) {
    counterNextDay++;

    const forecastHour = formatHourlyTime(el.time);
    const forecastTemperature = el.temp_c;
    const forecastIcon = el.condition.icon;

    if (counterCurrentDay + counterNextDay <= 24) {
      renderForecastHourlyForecasts(
        forecastHour + " Uhr",
        forecastIcon,
        roundNumber(forecastTemperature)
      );
    }
  }
}

function loadForecastDaysForecasts(forecastWeather) {
  const forecastday = forecastWeather.forecast.forecastday;

  const imageToday = forecastday[0].day.condition.icon;
  const imageTomorrow = forecastday[1].day.condition.icon;
  const imageDayAfterTomorrow = forecastday[2].day.condition.icon;

  const maxTempToday = forecastday[0].day.maxtemp_c;
  const maxTempTomorrow = forecastday[1].day.maxtemp_c;
  const maxTempDayAfterTomorrow = forecastday[2].day.maxtemp_c;

  const minTempToday = forecastday[0].day.mintemp_c;
  const minTempTomorrow = forecastday[1].day.mintemp_c;
  const minTempDayAfterTomorrow = forecastday[2].day.mintemp_c;

  const maxWindToday = forecastday[0].day.maxwind_kph;
  const maxWindTomorrow = forecastday[1].day.maxwind_kph;
  const maxWindDayAfterTomorrow = forecastday[2].day.maxwind_kph;

  renderForecastDaysForecasts(
    imageToday,
    imageTomorrow,
    imageDayAfterTomorrow,
    maxTempToday,
    maxTempTomorrow,
    maxTempDayAfterTomorrow,
    minTempToday,
    minTempTomorrow,
    minTempDayAfterTomorrow,
    maxWindToday,
    maxWindTomorrow,
    maxWindDayAfterTomorrow
  );
}

function loadMiniStats(current, currentDay) {
  const humidity = current.humidity;
  const feelsLike = current.feelslike_c;
  const sunrise = currentDay.astro.sunrise;
  const sunset = currentDay.astro.sunset;
  const precip = currentDay.day.totalprecip_mm;
  const uv = current.uv;
  renderMiniStats(humidity, feelsLike, sunrise, sunset, precip, uv);
}

export function loadBackgroundImage(current) {
  const conditionId = current.condition.code;
  const isDay = current.is_day;
  let imagePath = "";

  if (isDay === 1) {
    imagePath = getConditionImagePath(conditionId);
  } else {
    imagePath = getConditionImagePath(conditionId, true);
  }

  return imagePath;
}

function renderApp() {
  body[0].innerHTML = `
  <div id="app-detailview">
  </div>
  `;
}

function renderNavBar() {
  app.innerHTML += `
  <div class="navbar">
      <svg viewBox="0 0 1024 1024" fill="#ffffffff" class="navbar__back-btn"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M669.6 849.6c8.8 8 22.4 7.2 30.4-1.6s7.2-22.4-1.6-30.4l-309.6-280c-8-7.2-8-17.6 0-24.8l309.6-270.4c8.8-8 9.6-21.6 2.4-30.4-8-8.8-21.6-9.6-30.4-2.4L360.8 480.8c-27.2 24-28 64-0.8 88.8l309.6 280z" fill=""/></svg>
      <svg viewBox="0 0 1024 1024" fill="#ffffffff" class="navbar__favourite-btn"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M802.4 967.2c-7.2 0-15.2-1.6-21.6-4.8l-258.4-128.8-252.8 140c-18.4 10.4-41.6 5.6-56-9.6-8.8-9.6-12.8-23.2-11.2-36.8l43.2-285.6L33.6 444C20.8 432 16 414.4 21.6 397.6c4.8-16.8 18.4-28.8 36-31.2l285.6-48L464.8 56c7.2-15.2 22.4-25.6 39.2-26.4 17.6-0.8 33.6 8.8 41.6 24l133.6 256.8 287.2 35.2c17.6 2.4 31.2 13.6 36.8 30.4 5.6 16 1.6 34.4-10.4 46.4L790.4 629.6l55.2 284c2.4 12.8-0.8 26.4-8.8 36.8-8.8 10.4-21.6 16.8-34.4 16.8zM520.8 784.8c7.2 0 15.2 1.6 21.6 4.8l255.2 127.2-54.4-280c-3.2-14.4 1.6-29.6 12-40l200-203.2L672 358.4c-14.4-1.6-28-11.2-34.4-24L506.4 81.6 385.6 340c-6.4 13.6-19.2 23.2-33.6 25.6L70.4 412l208 194.4c11.2 10.4 16 24.8 13.6 40L249.6 928l249.6-137.6c7.2-3.2 14.4-4.8 21.6-5.6z" fill="" /></svg>
  </div>`;
}

function renderCurrentWeather(
  locationName,
  temperature,
  conditionText,
  maxTemperature,
  minTemperature
) {
  app.innerHTML += `
    <div class="current-weather">
      <div class="current-weather__location">${locationName}</div>
      <div class="current-weather__temperature">${temperature}°</div>
      <div class="current-weather__condition">${conditionText}</div>
      <div class="current-weather__max-and-min-temperature">
        <div class="curent-weather__max-temperature">H: ${maxTemperature}°</div>
        <div class="curent-weather__min-temperature">T: ${minTemperature}°</div>
    </div>
    </div>
        `;
}

function renderForecastHourlyTitle(conditionForecastText, maxWindForecast) {
  app.innerHTML += `
  <div class="forecast-hourly">
    <div class="forecast-hourly__title">Heute ${conditionForecastText}. Wind bis zu ${maxWindForecast} km/h.</div>
    <div class="forecast-hourly__forecasts"></div>
  </div>
  `;
}

function renderForecastHourlyForecasts(
  forecastHour,
  forecastIcon,
  forecastTemperature
) {
  const forecastHourlyForecasts = document.querySelector(
    ".forecast-hourly__forecasts"
  );
  forecastHourlyForecasts.innerHTML += `
  <div class="forecast-hourly__forecast">
    <span>${forecastHour}</span>
    <img src="${forecastIcon}" alt="" />
    <span>${forecastTemperature}°</span>
  </div>
  `;
}

function renderForecastDaysForecasts(
  imageToday,
  imageTomorrow,
  imageDayAfterTomorrow,
  maxTempToday,
  maxTempTomorrow,
  maxTempDayAfterTomorrow,
  minTempToday,
  minTempTomorrow,
  minTempDayAfterTomorrow,
  maxWindToday,
  maxWindTomorrow,
  maxWindDayAfterTomorrow
) {
  const today = new Date().getDay();

  let tomorrow = 0;
  if (today === 6) {
    tomorrow === 0;
  } else {
    tomorrow = today + 1;
  }

  let dayAfterTomorrow = 0;
  if (tomorrow === 6) {
    dayAfterTomorrow = 0;
  } else {
    dayAfterTomorrow = today + 2;
  }
  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  app.innerHTML += `
        <div class="forecast-day">
        <div class="forecast-day__title">
          Vorhersage für die nächsten 3 Tage:
        </div>
        <div class="forecast-day__forecasts"></div>
          <div class="forecast-day__forecast">
            <span class="forecast-day__day">Heute</span>
            <img src=${imageToday} alt="" class="forecast-day__image" />
            <span class="forecas-day__max-temp">H: ${roundNumber(
              maxTempToday
            )}°</span>
            <span class="forecast-day__min-temp">T: ${roundNumber(
              minTempToday
            )}°</span>
            <span class="forecast-day__wind">Wind: ${maxWindToday} km/h</span>
          </div>
          <div class="forecast-day__forecast">
            <span class="forecast-day__day">${dayNames[tomorrow]}</span>
            <img src=${imageTomorrow} alt="" class="forecast-day__image" />
            <span class="forecas-day__max-temp">H: ${roundNumber(
              maxTempTomorrow
            )}°</span>
            <span class="forecast-day__min-temp">T: ${roundNumber(
              minTempTomorrow
            )}°</span>
            <span class="forecast-day__wind">Wind: ${maxWindTomorrow} km/h</span>
          </div>
          <div class="forecast-day__forecast">
            <span class="forecast-day__day">${dayNames[dayAfterTomorrow]}</span>
            <img src=${imageDayAfterTomorrow} alt="" class="forecast-day__image" />
            <span class="forecas-day__max-temp">H: ${roundNumber(
              maxTempDayAfterTomorrow
            )}°</span>
            <span class="forecast-day__min-temp">T: ${roundNumber(
              minTempDayAfterTomorrow
            )}°</span>
            <span class="forecast-day__wind">Wind: ${maxWindDayAfterTomorrow} km/h</span>
          </div>
        </div>
  `;
}

function renderMiniStats(humidity, feelsLike, sunrise, sunset, precip, uv) {
  app.innerHTML += `
  <div class="mini-stats">
    <div class="mini-stat">
      <span class="mini-stat__title">Feuchtigkeit</span>
      <span class="mini-stat__value">${humidity}%</span>
    </div>
    <div class="mini-stat">
      <span class="mini-stat__title">Gefühlt</span>
      <span class="mini-stat__value">${roundNumber(feelsLike)}°</span>
    </div>
    <div class="mini-stat">
      <span class="mini-stat__title">Sonnenaufgang</span>
      <span class="mini-stat__value">${splitTime(sunrise)} Uhr</span>
    </div>
    <div class="mini-stat">
      <span class="mini-stat__title">Sonnenuntergang</span>
      <span class="mini-stat__value">${splitTimePM(sunset)} Uhr</span>
    </div>
    <div class="mini-stat">
      <span class="mini-stat__title">Niederschlag</span>
      <span class="mini-stat__value">${precip} mm</span>
    </div>
    <div class="mini-stat">
      <span class="mini-stat__title">UV-Index</span>
      <span class="mini-stat__value">${uv}</span>
    </div>
  </div>
  `;
}

function renderBackgroundImage(imagePath) {
  app.setAttribute(
    "style",
    `background-image: linear-gradient(0deg,#0003,#0003), url("${imagePath}"); background-size: cover; background-position: center;`
  );
}

function storeFavourite() {
  let favouritesFromStorage = JSON.parse(localStorage.getItem("favourites"));
  const favouriteName = document.querySelector(
    ".current-weather__location"
  ).innerHTML;
  if (favouritesFromStorage) {
    favouritesFromStorage.push(favouriteName);
    localStorage.setItem("favourites", JSON.stringify(favouritesFromStorage));
  } else {
    favouritesFromStorage = [];
    favouritesFromStorage.push(favouriteName);
    localStorage.setItem("favourites", JSON.stringify(favouritesFromStorage));
  }
}

function registerEventListener() {
  const backBtnEl = document.querySelector(".navbar__back-btn");
  const favouriteBtnEl = document.querySelector(".navbar__favourite-btn");

  backBtnEl.addEventListener("click", loadStartScreen);
  favouriteBtnEl.addEventListener("click", storeFavourite);
}
