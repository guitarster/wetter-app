import { getForecastWeather } from "./API.js";
import { roundNumber } from "./utils.js";

const currentWeatherEl = document.querySelector(".current-weather");

export async function loadWeather(location) {
  const forecastWeather = await getForecastWeather(location);

  const locationName = forecastWeather.location.name;
  const temperature = forecastWeather.current.temp_c;
  const conditionText = forecastWeather.current.condition.text;
  const maxTemperature = forecastWeather.forecast.forecastday[0].day.maxtemp_c;
  const minTemperature = forecastWeather.forecast.forecastday[0].day.mintemp_c;

  renderCurrentWeather(
    locationName,
    roundNumber(temperature),
    conditionText,
    roundNumber(maxTemperature),
    roundNumber(minTemperature)
  );
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
