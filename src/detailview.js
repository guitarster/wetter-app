import { getForecastWeather } from "./API.js";
import { roundNumber, formatHourlyTime } from "./utils.js";

const currentWeatherEl = document.querySelector(".current-weather");
const forecastHourlyTitleEl = document.querySelector(".forecast-hourly__title");
const forecastHourlyForecasts = document.querySelector(
  ".forecast-hourly__forecasts"
);

export async function loadWeather(location) {
  const forecastWeather = await getForecastWeather(location);
  const currentDay = forecastWeather.forecast.forecastday[0];

  const locationName = forecastWeather.location.name;
  const temperature = forecastWeather.current.temp_c;
  const conditionText = forecastWeather.current.condition.text;
  const maxTemperature = currentDay.day.maxtemp_c;
  const minTemperature = currentDay.day.mintemp_c;

  const conditionForecastText = currentDay.day.condition.text;
  const maxWindForecast = currentDay.day.maxwind_kph;

  const forecastHours = currentDay.hour;
  const forecastHoursNextDay = forecastWeather.forecast.forecastday[1].hour;

  const currentTime = formatHourlyTime(forecastWeather.current.last_updated);

  let counterCurrentDay = 0;

  for (let element of forecastHours) {
    counterCurrentDay++;

    const forecastHour = formatHourlyTime(element.time);
    const forecastTemperature = element.temp_c;
    const forecastIcon = element.condition.icon;

    if (forecastHour === currentTime) {
      renderForecastHourlyForecasts(
        "Jetzt",
        forecastIcon,
        roundNumber(forecastTemperature)
      );
    } else if (forecastHour >= currentTime) {
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
