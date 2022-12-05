const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const refs = {
  formEl: document.querySelector('form'),
  myLocationBtn: document.querySelector('.mylocation-button'),
  articleIconEl: document.querySelector('.article-weather__icon'),
  articleDateEl: document.querySelector('p.article-date'),
  articleCityEl: document.querySelector('h1.article-city'),
  currentTemp: document.querySelector('.current-temp .temp'),
  maxTemp: document.querySelector('.day-temp .temp'),
  minTemp: document.querySelector('.night-temp .temp'),
  descrEl: document.querySelector('.weather-description'),
  feelsLikeTemp: document.querySelector('.feels-like-temp .temp'),
  celsiusLink: document.querySelector('a.celsius'),
  farengeitLink: document.querySelector('a.farengeit'),
  humidityLev: document.querySelector('.humidity-level'),
  windSpeed: document.querySelector('.wind-speed'),
  updateBtn: document.querySelector('.update-button'),
};

const {
  formEl,
  myLocationBtn,
  articleIconEl,
  articleDateEl,
  articleCityEl,
  currentTemp,
  maxTemp,
  minTemp,
  descrEl,
  feelsLikeTemp,
  celsiusLink,
  farengeitLink,
  humidityLev,
  windSpeed,
  updateBtn,
} = refs;

const apiCityUrl = 'https://api.shecodes.io/weather/v1/current?';
const apiForecastUrl = 'https://api.shecodes.io/weather/v1/forecast?';
const apiKey = 'f848t750a97035b716efo4aca2d7b383';

formEl.addEventListener('submit', onSubmit);
myLocationBtn.addEventListener('click', getLocation);
farengeitLink.addEventListener('click', convertToFarengeit);
celsiusLink.addEventListener('click', convertToCelsius);
updateBtn.addEventListener('click', updateDate);

function fetchData(url, message) {
  axios
    .get(url)
    .then(res => {
      if (url.includes(apiCityUrl)) {
        showWeatherNow(res);
      } else {
        showWeatherForecast(res);
      }
    })
    .catch(e => {
      console.log(e);
      alert(message);
    });
}

function onSubmit(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.input.value;

  const paramsObj = {
    query,
    key: apiKey,
    units: 'metric',
  };

  const searchParams = new URLSearchParams(paramsObj).toString();
  const cityUrl = `${apiCityUrl}${searchParams}`;
  const forecastUrl = `${apiForecastUrl}${searchParams}`;
  const message =
    'There is no such city in our database. Please, try checking weather with Google';
  fetchData(cityUrl, message);
  fetchData(forecastUrl, message);
}

function showDateNow(timestamp) {
  let date = '';

  if (timestamp) {
    const newTimestamp = timestamp * 1000;
    date = new Date(newTimestamp);
  } else {
    date = new Date();
  }

  const day = days[date.getDay()];
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${day} ${hours}:${minutes}`;
}

function getLocation(e) {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

function handlePosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const paramsObj = {
    lon: longitude,
    lat: latitude,
    key: apiKey,
    units: 'metric',
  };

  const searchParams = new URLSearchParams(paramsObj).toString();
  const cityUrl = `${apiCityUrl}${searchParams}`;

  const message = 'Oops, something went wrong. Please, try again';

  fetchData(cityUrl, message);
}

function showWeatherNow(response) {
  console.log(response.data);

  const {
    city,
    condition: { description, icon, icon_url },
    temperature: { current, humidity, feels_like },
    wind: { speed },
    time,
  } = response.data;

  articleDateEl.innerHTML = showDateNow(time);
  articleCityEl.innerHTML = city;
  currentTemp.innerHTML = Math.round(current);
  descrEl.innerHTML = description;
  feelsLikeTemp.innerHTML = Math.round(feels_like);
  humidityLev.innerHTML = Math.round(humidity);
  windSpeed.innerHTML = Math.round(speed);
  articleIconEl.setAttribute('src', icon_url);
  articleIconEl.setAttribute('alt', icon);
}

function showWeatherForecast(response) {
  console.log(response.data);

  // maxTemp.innerHTML = Math.round(maximum);
  // minTemp.innerHTML = Math.round(minimum);
}

let inCelsius = true;

function convertToFarengeit(e) {
  e.preventDefault();
  if (inCelsius) {
    const tempInFarengeit = Math.round(currentTemp.textContent * 1.8 + 32);

    const maxTempInFarengeit = Math.round(maxTemp.textContent * 1.8 + 32);
    const minTempInFarengeit = Math.round(minTemp.textContent * 1.8 + 32);
    const feelsLikeTempInFarengeit = Math.round(
      feelsLikeTemp.textContent * 1.8 + 32,
    );

    currentTemp.innerHTML = tempInFarengeit;
    maxTemp.innerHTML = maxTempInFarengeit;
    minTemp.innerHTML = minTempInFarengeit;
    feelsLikeTemp.innerHTML = feelsLikeTempInFarengeit;

    inCelsius = false;
  } else {
    return;
  }
}

function convertToCelsius(e) {
  e.preventDefault();
  if (!inCelsius) {
    const tempInCelsius = Math.round((currentTemp.textContent - 32) / 1.8);
    const maxTempInCelsius = Math.round((maxTemp.textContent - 32) / 1.8);
    const minTempInCelsius = Math.round((minTemp.textContent - 32) / 1.8);
    const feelsLikeTempInCelsius = Math.round(
      (feelsLikeTemp.textContent - 32) / 1.8,
    );

    currentTemp.innerHTML = tempInCelsius;
    maxTemp.innerHTML = maxTempInCelsius;
    minTemp.innerHTML = minTempInCelsius;
    feelsLikeTemp.innerHTML = feelsLikeTempInCelsius;
    inCelsius = true;
  } else {
    return;
  }
}

function updateDate(e) {
  e.preventDefault();
  articleDateEl.innerHTML = showDateNow();
}
