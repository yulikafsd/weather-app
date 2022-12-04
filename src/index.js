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

const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?';
const apiKey = '0a410cb602b47800e6427b619987ee25';

formEl.addEventListener('submit', onSubmit);
myLocationBtn.addEventListener('click', getLocation);
farengeitLink.addEventListener('click', convertToFarengeit);
celsiusLink.addEventListener('click', convertToCelsius);
updateBtn.addEventListener('click', updateDate);

function onSubmit(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.input.value;

  const paramsObj = {
    q: query,
    limit: 1,
    appid: apiKey,
    units: 'metric',
  };

  const searchParams = new URLSearchParams(paramsObj).toString();
  const url = `${apiUrl}${searchParams}`;

  axios
    .get(url)
    .then(showWeather)
    .catch(e => {
      console.log(e);
      alert(
        `There is no such city in our database. Please, try checking weather with https://www.google.com/search?q=google+weather+${query}`,
      );
    });
}

function showDateNow() {
  let newDate = new Date();
  const day = days[newDate.getDay()];
  const hours =
    newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes =
    newDate.getMinutes() < 10
      ? `0${newDate.getMinutes()}`
      : newDate.getMinutes();
  const currentDate = `${day} ${hours}:${minutes}`;
  articleDateEl.innerHTML = currentDate;
}

function getLocation(e) {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

function handlePosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const paramsObj = {
    lat: latitude,
    lon: longitude,
    appid: apiKey,
    units: 'metric',
  };

  const searchParams = new URLSearchParams(paramsObj).toString();
  const url = `${apiUrl}${searchParams}`;

  axios
    .get(url)
    .then(showWeather)
    .catch(e => {
      console.log(e);
      alert(`Oops, something went wrong. Please, try again`);
    });
}

function showWeather(response) {
  showDateNow();

  const apiCity = response.data.name;
  const apiTemp = Math.round(response.data.main.temp);
  const description = response.data.weather[0].main;
  const apiMinTemp = Math.round(response.data.main.temp_min);
  const apiMaxTemp = Math.round(response.data.main.temp_max);
  const apiFeelsLikeTemp = Math.round(response.data.main.feels_like);
  const apiHumidity = Math.round(response.data.main.humidity);
  const apiWind = Math.round(response.data.wind.speed);

  articleCityEl.innerHTML = apiCity;
  currentTemp.innerHTML = apiTemp;
  maxTemp.innerHTML = apiMaxTemp;
  minTemp.innerHTML = apiMinTemp;
  descrEl.innerHTML = description;
  feelsLikeTemp.innerHTML = apiFeelsLikeTemp;
  humidityLev.innerHTML = apiHumidity;
  windSpeed.innerHTML = apiWind;
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
  showDateNow();
}
