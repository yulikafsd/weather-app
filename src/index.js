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
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const refs = {
  formEl: document.querySelector('form'),
  myLocationBtn: document.querySelector('.mylocation-button'),
  cityLinksList: document.querySelector('.city-links-list'),
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
  forecastEl: document.querySelector('.forecast-container'),
  todayDegreesEl: document.querySelectorAll('.today.forecast-degrees'),
};

const {
  formEl,
  myLocationBtn,
  cityLinksList,
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
  forecastEl,
  todayDegreesEl,
} = refs;

const apiCityUrl = 'https://api.shecodes.io/weather/v1/current?';
const apiForecastUrl = 'https://api.shecodes.io/weather/v1/forecast?';
const apiKey = 'f848t750a97035b716efo4aca2d7b383';
let inCelsius = true;
let query = '';
let search = '';
let arr;

window.addEventListener('load', onLoad);
myLocationBtn.addEventListener('click', getLocation);
formEl.addEventListener('submit', onSubmit);
cityLinksList.addEventListener('click', onClick);
farengeitLink.addEventListener('click', convertDegree);
celsiusLink.addEventListener('click', convertDegree);
updateBtn.addEventListener('click', updateForecast);

function onLoad() {
  search = 'byLocation';
  getLocation();
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(handlePosition);
  search = 'byLocation';
}

function fetchData(url, message) {
  if (farengeitLink.classList.contains('isactive')) {
    farengeitLink.classList.remove('isactive');
    celsiusLink.classList.add('isactive');
    todayDegreesEl.forEach(elem => (elem.textContent = '°C'));
    inCelsius = true;
  }

  formEl.reset();

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
      alert(message);
    });
}

function onSubmit(e) {
  e.preventDefault();
  search = 'byQuery';
  query = e.currentTarget.elements.input.value;

  makeFetchByQuery(query);
}

function makeFetchByQuery(query) {
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
  const forecastUrl = `${apiForecastUrl}${searchParams}`;

  const message = 'Oops, something went wrong. Please, try again';

  fetchData(cityUrl, message);
  fetchData(forecastUrl, message);
}

function onClick(e) {
  if (e.target !== e.currentTarget) {
    query = e.target.textContent;
    makeFetchByQuery(query);
  }
}

function showWeatherNow(response) {
  const {
    city,
    condition: { description, icon, icon_url },
    temperature: { current, humidity, feels_like },
    wind: { speed },
    time,
  } = response.data;

  articleDateEl.innerHTML = showDateNow(time);
  articleCityEl.innerHTML = city;
  currentTemp.innerHTML = checkTemp(Math.round(current));
  descrEl.innerHTML = description;
  feelsLikeTemp.innerHTML = checkTemp(Math.round(feels_like));
  humidityLev.innerHTML = Math.round(humidity);
  windSpeed.innerHTML = Math.round(speed);
  articleIconEl.setAttribute('src', icon_url);
  articleIconEl.setAttribute('alt', icon);
}

function showWeatherForecast(response) {
  forecastEl.innerHTML = '';

  const { daily } = response.data;

  const todayMaxTemp = Math.round(daily[0].temperature.maximum);
  const todayMinTemp = Math.round(daily[0].temperature.minimum);

  maxTemp.innerHTML = checkTemp(todayMaxTemp);
  minTemp.innerHTML = checkTemp(todayMinTemp);

  const newForecast = daily.slice(1, 4);

  const markup = newForecast
    .map((dayForecast, ind) => {
      const {
        condition: { description, icon, icon_url },
        temperature: { day, maximum, minimum },
        time,
      } = dayForecast;

      const forecastDate = showDateForecast(time);
      const { weekDay, date, month } = forecastDate;

      return `<div class="col">
        <div class="card shadow-custom">
          <div class="card-body">
            <h2 class="card-day">${weekDay}</h2>
            <p>${date} ${month}</p>
            <img class="forecast-img" src=${icon_url} alt=${icon} width="80"/>
            <p>
            <span class="day-temp-${ind}">${checkTemp(Math.round(day))}</span>
            <span class="forecast-degrees">°C</span>
            </p>
            <p class="forecast-descr">${description}</p>
            <div class="d-flex align-items-center justify-content-center">
            <i class="trend-icon fa-solid fa-up-long ms-1"></i>
            <p>
            <span class="max-temp-${ind}">${checkTemp(
        Math.round(maximum),
      )}</span>
            <span class="forecast-degrees">°C</span>
            </p>
            </div>
            <div class="d-flex align-items-center justify-content-center">
            <i class="trend-icon fa-solid fa-down-long ms-1"></i>
            <p>
            <span class="min-temp-${ind}">${checkTemp(
        Math.round(minimum),
      )}</span>
            <span class="forecast-degrees">°C</span>
            </p>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join('');

  forecastEl.insertAdjacentHTML('afterbegin', markup);
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

function showDateForecast(time) {
  const newDate = new Date(time * 1000);
  const weekDay = days[newDate.getDay()];
  const date = newDate.getDate();
  const month = months[newDate.getMonth()];
  return { weekDay, date, month };
}

function checkTemp(temp) {
  const newTemp = temp > 0 ? `+${temp}` : temp;
  return newTemp;
}

function makeTempsArr() {
  const forecastDayTemp1 = document.querySelector('.day-temp-0');
  const forecastDayTemp2 = document.querySelector('.day-temp-1');
  const forecastDayTemp3 = document.querySelector('.day-temp-2');
  const forecastMaxTemp1 = document.querySelector('.max-temp-0');
  const forecastMaxTemp2 = document.querySelector('.max-temp-1');
  const forecastMaxTemp3 = document.querySelector('.max-temp-2');
  const forecastMinTemp1 = document.querySelector('.min-temp-0');
  const forecastMinTemp2 = document.querySelector('.min-temp-1');
  const forecastMinTemp3 = document.querySelector('.min-temp-2');

  const tempElements = [
    currentTemp,
    maxTemp,
    minTemp,
    feelsLikeTemp,
    forecastDayTemp1,
    forecastDayTemp2,
    forecastDayTemp3,
    forecastMaxTemp1,
    forecastMaxTemp2,
    forecastMaxTemp3,
    forecastMinTemp1,
    forecastMinTemp2,
    forecastMinTemp3,
  ];

  return tempElements;
}

function convertDegree() {
  let convert;
  const degrees = document.querySelectorAll('.forecast-degrees');

  if (inCelsius) {
    convert = el => Math.round(el.textContent * 1.8 + 32);
    degrees.forEach(degree => (degree.textContent = '°F'));
    celsiusLink.classList.remove('isactive');
    farengeitLink.classList.add('isactive');
    inCelsius = false;
  } else {
    convert = el => Math.round((el.textContent - 32) / 1.8);
    degrees.forEach(degree => (degree.textContent = '°C'));
    farengeitLink.classList.remove('isactive');
    celsiusLink.classList.add('isactive');
    inCelsius = true;
  }

  arr = makeTempsArr();
  arr.map(arrEl => {
    return (arrEl.innerHTML = checkTemp(convert(arrEl)));
  });
}

function updateForecast(e) {
  e.preventDefault();
  articleDateEl.innerHTML = showDateNow();

  if (search === 'byLocation') {
    getLocation();
  } else {
    makeFetchByQuery(query);
  }
}
