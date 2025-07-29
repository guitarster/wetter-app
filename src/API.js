const API_BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "81d83f0595614a6e8dc93225252907";

export async function getForecastWeather(location) {
  const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de`;

  const response = await fetch(url);

  const responseJSON = await response.json();

  return responseJSON;
}
