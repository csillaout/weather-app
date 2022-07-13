let now = new Date();
let sun = document.querySelector(".date");
let time = document.querySelector(".time");

let date = now.getDate();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Augst",
  "September",
  "October",
  "November",
  "December",
];
let month = months[now.getMonth()];

let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
time.innerHTML = `${hours} : ${minutes}`;
sun.innerHTML = `${day}, ${date} ${month}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2">
              <div class="weather-forecast-date">${formatDay(
                forecastDay.dt
              )}</div>
              <img 
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt=""
              width="42"
        />
              <div class="weather-forecast-temperatures">
                <div class="weather-forecast-temperature-max">Hi ${Math.round(
                  forecastDay.temp.max
                )}℃</div>
                <div class="weather-forecast-temperature-min"> Lo ${Math.round(
                  forecastDay.temp.min
                )}℃</div>
              </div>
            </div>
            `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//city

function search(city) {
  let apiKey = "0ba161ba8a4dc180d13a59ca0308a5e6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(calculate);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-form");

  search(city.value);
}

let form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

//temperature

function getForecast(coordinates) {
  let apiKey = "0ba161ba8a4dc180d13a59ca0308a5e6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function calculate(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )}km/h`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let city = document.querySelector(".city");
  city.innerHTML = response.data.name;
  celsiusTemp = response.data.main.temp;

  getForecast(response.data.coord);
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let heading = document.querySelector("h1");
  heading.innerHTML = `${temperature}`;
}

//current
function searchLocation(position) {
  let apiKey = "0ba161ba8a4dc180d13a59ca0308a5e6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(calculate);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function showFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let FahrenheitTemp = (celsiusTemp * 9) / 5 + 32;

  temperatureElement.innerHTML = Math.round(FahrenheitTemp);
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let currentLocationButton = document.querySelector("#current");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsius);

search("New York");
let celsiusTemp = null;
