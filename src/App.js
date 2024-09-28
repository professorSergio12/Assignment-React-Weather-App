import { useState } from "react";
import "./App.css";

import cloudImage from "./images/cloud.png";
import clearImage from "./images/clear.png";
import rainImage from "./images/rain.png";
import mistImage from "./images/mist.png";
import snowImage from "./images/snow.png";
import defaultImage from "./images/default.avif";
import notFoundImage from "./images/404.png";

function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setData] = useState(null);
  const [error, setError] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [weatherImage, setWeatherImg] = useState("");
  const [temp, setTemp] = useState("C");

  async function handleClick() {
    setError(false);
    const api_key = "a811d263fe07b1b6797d207f35b0987d"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&temps=${temp}&appid=${api_key}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError(true);
        setData(null);
        setForecastData([]);
        return;
      }
      const weather_data = await response.json();
      console.log(weatherData)
      setData(weather_data);

      // Fetch the 3-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&temps=${temp}&appid=${api_key}`;
      const forecastResponse = await fetch(forecastUrl);
      const forecast_data = await forecastResponse.json();

      setForecastData(
        forecast_data.list.filter((item, index) => index % 8 === 0).slice(0, 3)
      );

      switch (weather_data.weather[0].main) {
        case "Clouds":
          setWeatherImg(cloudImage);
          break;
        case "Clear":
          setWeatherImg(clearImage);
          break;
        case "Rain":
          setWeatherImg(rainImage);
          break;
        case "Mist":
          setWeatherImg(mistImage);
          break;
        case "Snow":
          setWeatherImg(snowImage);
          break;
        default:
          setWeatherImg(defaultImage);
          break;
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(true);
      setData(null);
      setForecastData([]);
    }
  }

  const toggletemp = () => {
    setTemp(temp === "C" ? "F" : "C");
  };

  return (
    <div className="container">
      <div className="header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter your location"
            className="input-box"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button id="searchBtn" onClick={handleClick}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <button onClick={toggletemp} className="toggle-button">
          Switch to {temp === "C" ? "Fahrenheit" : "Celsius"}
        </button>
      </div>

      {error && (
        <div className="location-not-found">
          <h1>Sorry, Location not found!!!</h1>
          <img src={notFoundImage} alt="404 Error" />
        </div>
      )}

      {weatherData && (
        <div className="weather-body">
          <img src={weatherImage} alt="Weather" className="weather-img" />

          <div className="weather-box">
            <p className="temperature">
              {temp === "C"
                ? weatherData.main.temp.toFixed(2) + " °C"
                : ((weatherData.main.temp * 9) / 5 + 32).toFixed(2) + " °F"}
            </p>
            <p className="description">{weatherData.weather[0].description}</p>
          </div>

          <div className="weather-details">
            <div className="humidity">
              <i className="fa-sharp fa-solid fa-droplet"></i>
              <div className="text">
                <span id="humidity">{weatherData.main.humidity}%</span>
                <p>Humidity</p>
              </div>
            </div>

            <div className="wind">
              <i className="fa-solid fa-wind"></i>
              <div className="text">
                <span id="wind-speed">{weatherData.wind.speed} Km/H</span>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Day Weather Forecast */}
      {forecastData.length > 0 && (
        <div className="forecast-body">
          <h2>3-Day Forecast</h2>
          <div className="forecast">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                <img
                  src={
                    day.weather[0].main === "Clouds"
                      ? cloudImage
                      : day.weather[0].main === "Clear"
                      ? clearImage
                      : day.weather[0].main === "Rain"
                      ? rainImage
                      : day.weather[0].main === "Mist"
                      ? mistImage
                      : day.weather[0].main === "Snow"
                      ? snowImage
                      : defaultImage
                  }
                  alt={day.weather[0].description}
                />
                <p>
                  {temp === "C"
                    ? day.main.temp.toFixed(2) + " °C"
                    : ((day.main.temp * 9) / 5 + 32).toFixed(2) + " °F"}
                </p>
                <p>{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
