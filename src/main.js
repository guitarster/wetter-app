import { getCurrentWeather, getForecastWeather } from "./API.js";

const currentWeatherEl = document.querySelector(".current-weather");
const spinnerEl = document.querySelector(".lds-ring");
const appEl = document.querySelector(".app-default");

const currentWeather = await getCurrentWeather();
const forecastWeather = await getForecastWeather();

if (currentWeather) {
  spinnerEl.classList.remove("lds-ring");
  appEl.classList.remove("app-default");
  appEl.classList.add("app");
}

currentWeatherEl.innerHTML = `
        <div class="current-weather__location">${currentWeather.location.name}</div>
        <div class="current-weather__temperature">${currentWeather.current.temp_c}°</div>
        <div class="current-weather__condition">${currentWeather.current.condition.text}</div>
        <div class="current-weather__max-and-min-temperature">
          <div class="curent-weather__max-temperature">${forecastWeather.forecast.forecastday[0].day.maxtemp_c}°</div>
          <div class="curent-weather__min-temperature">${forecastWeather.forecast.forecastday[0].day.mintemp_c}°</div>
        </div>`;
