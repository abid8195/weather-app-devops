const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("result");
const errorBox = document.getElementById("error");
const loading = document.getElementById("loading");
const forecastDiv = document.getElementById("forecast");
const forecastCards = document.getElementById("forecastCards");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const feelsLike = document.getElementById("feelsLike");
const tempMin = document.getElementById("tempMin");
const tempMax = document.getElementById("tempMax");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const weatherIcon = document.getElementById("weatherIcon");


const API_KEY = "010714e39d5b1a8ae2585d1238a9f0d3";

async function getWeather(city = null, lat = null, lon = null) {
  errorBox.classList.add("hidden");
  result.classList.add("hidden");
  forecastDiv.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    let currentUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;
    if (city) {
      currentUrl += `&q=${city}`;
    } else if (lat && lon) {
      currentUrl += `&lat=${lat}&lon=${lon}`;
    } else {
      throw new Error("No city or location provided.");
    }

    const currentRes = await fetch(currentUrl);
    if (!currentRes.ok) {
      throw new Error("City not found or API error.");
    }
    const currentData = await currentRes.json();

    // Display current weather
    cityName.textContent = `${currentData.name}, ${currentData.sys.country}`;
    description.textContent = currentData.weather[0].description;
    temp.textContent = Math.round(currentData.main.temp);
    feelsLike.textContent = Math.round(currentData.main.feels_like);
    tempMin.textContent = Math.round(currentData.main.temp_min);
    tempMax.textContent = Math.round(currentData.main.temp_max);
    humidity.textContent = `Humidity: ${currentData.main.humidity}%`;
    wind.textContent = `Wind: ${currentData.wind.speed} m/s`;
    pressure.textContent = currentData.main.pressure;
    visibility.textContent = (currentData.visibility / 1000).toFixed(1);
    const sunriseTime = new Date(currentData.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(currentData.sys.sunset * 1000).toLocaleTimeString();
    sunrise.textContent = sunriseTime;
    sunset.textContent = sunsetTime;
  weatherIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;

    result.classList.remove("hidden");

    // Get forecast using lat/lon from current data
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${API_KEY}&units=metric`;
    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) {
      throw new Error("Forecast not available.");
    }
    const forecastData = await forecastRes.json();

    // Display 5-day forecast (take one per day, e.g., at 12:00)
    forecastCards.innerHTML = "";
    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    dailyForecasts.forEach(day => {
      const date = new Date(day.dt * 1000).toLocaleDateString();
      const card = document.createElement("div");
      card.classList.add("forecast-card");
      card.innerHTML = `
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Icon" width="50" height="50" />
        <p>${day.weather[0].description}</p>
        <p>${Math.round(day.main.temp)}0C</p>
      `;
      forecastCards.appendChild(card);
    });

    forecastDiv.classList.remove("hidden");
  } catch (err) {
    errorBox.textContent = err.message || "Failed to fetch weather data.";
    errorBox.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  await getWeather(city);
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getWeather(null, latitude, longitude);
      },
      err => {
        errorBox.textContent = "Geolocation error: " + err.message;
        errorBox.classList.remove("hidden");
      }
    );
  } else {
    errorBox.textContent = "Geolocation is not supported by this browser.";
    errorBox.classList.remove("hidden");
  }
});