const API_BASE_URL = "https://api.weatherapi.com/v1";
const API_KEY = "81d83f0595614a6e8dc93225252907";
const API_DAYS = 3;

export async function getForecastWeather(location) {
  const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de&days=${API_DAYS}`;

  const response = await fetch(url);

  const responseJSON = await response.json();

  return responseJSON;
}
