import { getForecastWeather } from "./API.js";
import { roundNumber } from "./utils.js";

const currentWeatherEl = document.querySelector(".current-weather");
const forecastHourlyTitleEl = document.querySelector(".forecast-hourly__title");
const forecastHourlyForecasts = document.querySelector(
  ".forecast-hourly__forecasts"
);

const hourRightNow = new Date().getHours();

export async function loadWeather(location) {
  const forecastWeather = await getForecastWeather(location);

  const locationName = forecastWeather.location.name;
  const temperature = forecastWeather.current.temp_c;
  const conditionText = forecastWeather.current.condition.text;
  const maxTemperature = forecastWeather.forecast.forecastday[0].day.maxtemp_c;
  const minTemperature = forecastWeather.forecast.forecastday[0].day.mintemp_c;

  const conditionForecastText =
    forecastWeather.forecast.forecastday[0].day.condition.text;
  const maxWindForecast =
    forecastWeather.forecast.forecastday[0].day.maxwind_kph;

  const forecastHours = forecastWeather.forecast.forecastday[0].hour;
  const forecastHoursNextDay = forecastWeather.forecast.forecastday[1].hour;

  let counterCurrentDay = 0;

  for (let element of forecastHours) {
    const forecastHour = element.time_epoch;
    const date = new Date(forecastHour * 1000);
    const hours = date.getHours();

    const forecastTemperature = element.temp_c;
    const forecastIcon = element.condition.icon;

    if (hours === hourRightNow) {
      counterCurrentDay++;
      renderForecastHourlyForecasts(
        "Jetzt",
        forecastIcon,
        roundNumber(forecastTemperature)
      );
    } else if (hours >= hourRightNow) {
      counterCurrentDay++;
      renderForecastHourlyForecasts(
        hours + " Uhr",
        forecastIcon,
        roundNumber(forecastTemperature)
      );
    }
  }

  let counterNextDay = 0;

  for (let el of forecastHoursNextDay) {
    counterNextDay++;
    const forecastHour = el.time_epoch;
    const date = new Date(forecastHour * 1000);
    const hours = date.getHours();

    const forecastTemperature = el.temp_c;
    const forecastIcon = el.condition.icon;

    if (counterCurrentDay + counterNextDay <= 24) {
      renderForecastHourlyForecasts(
        hours + " Uhr",
        forecastIcon,
        roundNumber(forecastTemperature)
      );
    }
  }

  renderCurrentWeather(
    locationName,
    roundNumber(temperature),
    conditionText,
    roundNumber(maxTemperature),
    roundNumber(minTemperature)
  );

  renderForecastHourlyTitle(conditionForecastText, maxWindForecast);
}

function renderCurrentWeather(
  locationName,
  temperature,
  conditionText,
  maxTemperature,
  minTemperature
) {
  currentWeatherEl.innerHTML = `
        <div class="current-weather__location">${locationName}</div>
        <div class="current-weather__temperature">${temperature}°</div>
        <div class="current-weather__condition">${conditionText}</div>
        <div class="current-weather__max-and-min-temperature">
          <div class="curent-weather__max-temperature">${maxTemperature}°</div>
          <div class="curent-weather__min-temperature">${minTemperature}°</div>
        </div>`;
}

function renderForecastHourlyTitle(conditionForecastText, maxWindForecast) {
  forecastHourlyTitleEl.innerHTML = `
  Heute ${conditionForecastText}. Wind bis zu ${maxWindForecast} km/h.`;
}

function renderForecastHourlyForecasts(
  forecastHour,
  forecastIcon,
  forecastTemperature
) {
  forecastHourlyForecasts.innerHTML += `
  <div class="forecast-hourly__forecast">
    <span>${forecastHour}</span>
    <img src="${forecastIcon}" alt="" />
    <span>${forecastTemperature}°</span>
  </div>
  `;
}
