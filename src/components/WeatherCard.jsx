import React, { useEffect, useState } from 'react';
import HourlyGraph from '../components/HourlyGraph';
import {
  WiThermometer,
  WiBarometer,
  WiHumidity,
  WiCloudyGusts,
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow
} from 'react-icons/wi';
import axios from 'axios';

const API_KEY = "84c0ee8a268dc9d02944341ba3109f0e"; // Replace with your OpenWeatherMap API Key

const WeatherCard = ({ weather }) => {
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState('');
  const [liveTime, setLiveTime] = useState(new Date());

  // Update live time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch 5-day forecast using the 5-day/3-hour endpoint
  const fetchForecast = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const filteredForecast = response.data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(filteredForecast.slice(0, 5)); // Get the next 5 days
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  // Fetch Air Quality
  const fetchAirQuality = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const aqi = response.data.list[0].main.aqi;
      switch (aqi) {
        case 1:
          setAirQuality('Good');
          break;
        case 2:
          setAirQuality('Fair');
          break;
        case 3:
          setAirQuality('Moderate');
          break;
        case 4:
          setAirQuality('Poor');
          break;
        case 5:
          setAirQuality('Very Poor');
          break;
        default:
          setAirQuality('Unknown');
      }
    } catch (error) {
      console.error('Error fetching air quality:', error);
    }
  };

  useEffect(() => {
    if (weather.coord) {
      fetchForecast(weather.coord.lat, weather.coord.lon);
      fetchAirQuality(weather.coord.lat, weather.coord.lon);
    }
  }, [weather]);

  // Calculate Dew Point
  const calculateDewPoint = (temp, humidity) => {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint.toFixed(1);
  };

  const getForecastIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <WiDaySunny size={40} />;
      case 'Clouds':
        return <WiCloud size={40} />;
      case 'Rain':
        return <WiRain size={40} />;
      case 'Snow':
        return <WiSnow size={40} />;
      default:
        return <WiDaySunny size={40} />;
    }
  };

  const getBackgroundColor = (condition) => {
    switch (condition) {
      case 'Clear':
        return 'bg-blue-500';
      case 'Clouds':
        return 'bg-gray-400';
      case 'Rain':
        return 'bg-blue-700';
      case 'Snow':
        return 'bg-blue-200';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Current Weather */}
      <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-xl w-full max-w-4xl mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <p className="text-sm">{liveTime.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            {getForecastIcon(weather.weather[0].main)}
            <h3 className="text-6xl font-bold">{Math.round(weather.main.temp)}°C</h3>
            <div className="ml-4">
              <p className="text-xl font-semibold">{weather.weather[0].main}</p>
              <p className="text-sm">Feels like {Math.round(weather.main.feels_like)}°</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div className="text-center">
            <p>Air Quality</p>
            <p>{airQuality}</p>
          </div>
          <div className="text-center">
            <p>Humidity</p>
            <p>{weather.main.humidity}%</p>
          </div>
          <div className="text-center">
            <p>Dew Point</p>
            <p>{calculateDewPoint(weather.main.temp, weather.main.humidity)}°C</p>
          </div>
          <div className="text-center">
            <p>Pressure</p>
            <p>{weather.main.pressure} hPa</p>
          </div>
          <div className="text-center">
            <p>Visibility</p>
            <p>{weather.visibility / 1000} km</p>
          </div>
          <div className="text-center">
            <p>Wind</p>
            <p>{weather.wind.speed} km/h</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-xl w-full max-w-4xl">
        <h3 className="text-2xl font-bold text-black text-center mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <div
              key={index}
              className={`rounded-2xl p-4 shadow-md text-center text-white flex flex-col items-center justify-center ${getBackgroundColor(day.weather[0].main)}`}
            >
              <p className="font-semibold">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              {getForecastIcon(day.weather[0].main)}
              <p className="text-lg">{Math.round(day.main.temp)}°C</p>
              <p className="capitalize text-sm">{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ ADDED: Hourly Weather Graph */}
      {weather.coord && (
        <div className="mt-6 w-full max-w-4xl p-4 bg-white bg-opacity-90 rounded-xl shadow-xl overflow-x-auto whitespace-nowrap">
        <h3 className="text-lg font-semibold text-center text-black mb-2">Hourly Temperature</h3>
        <div className="min-w-[800px]"> {/* Ensure a minimum width for scrolling */}
          <HourlyGraph lat={weather.coord.lat} lon={weather.coord.lon} />
        </div>
      </div>
      )}
    </div>
  );
};

export default WeatherCard;
