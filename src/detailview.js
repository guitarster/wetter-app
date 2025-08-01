import { getForecastWeather } from "./API.js";
import {
  roundNumber,
  formatHourlyTime,
  splitTime,
  splitTimePM,
} from "./utils.js";
import { getConditionImagePath } from "./conditions.js";
import { renderLoadScreen } from "./loadscreen.js";

const body = document.getElementsByTagName("body");
let app = "";

export function loadDetailView(location) {
  renderLoadScreen(location);
  loadWeather(location);
}

async function loadWeather(location) {
  const forecastWeather = await getForecastWeather(location);
  const currentDay = forecastWeather.forecast.forecastday[0];
  const current = forecastWeather.current;

  renderApp();
  app = document.getElementById("app-detailview");

  loadBackgroundImage(current);

  loadCurrentWeather(forecastWeather, currentDay);

  loadForecastHourlyTitle(currentDay);

  loadForecastHourlyForecasts(forecastWeather, currentDay);

  loadForecastDaysForecasts(forecastWeather);

  loadMiniStats(current, currentDay);
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

function loadBackgroundImage(current) {
  const conditionId = current.condition.code;
  const isDay = current.is_day;
  let imagePath = "";

  if (isDay === 1) {
    imagePath = getConditionImagePath(conditionId);
  } else {
    imagePath = getConditionImagePath(conditionId, true);
  }

  renderBackgroundImage(imagePath);
}

function renderApp() {
  body[0].innerHTML = `
  <div id="app-detailview">
  </div>
  `;
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
  const tomorrow = today + 1;
  const dayAfterTomorrow = today + 2;
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
