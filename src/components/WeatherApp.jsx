import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import Sidebar from "./Sidebar";
import AppName from './AppName';

const API_KEY = "84c0ee8a268dc9d02944341ba3109f0e";
const DEFAULT_CITY = "Wardha";

const WeatherApp = () => {
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);

      // Update recent searches
      const updatedRecent = [
        city,
        ...recentSearches.filter((item) => item !== city),
      ].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveLocationWeather = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setWeatherData(response.data);
          } catch (error) {
            console.error("Error fetching live location weather:", error);
            alert("Failed to get live location weather.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation Error:", error);
          alert("Failed to get live location.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(DEFAULT_CITY);
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, []);

  // Determine background color based on weather condition
  const getBackgroundColor = () => {
    if (!weatherData) return "bg-gray-900";
    const condition = weatherData.weather[0].main;
    switch (condition) {
      case "Clear":
        return "bg-blue-500"; // Bright Blue for Sunny
      case "Clouds":
        return "bg-gray-500"; // Medium Gray for Clouds
      case "Rain":
        return "bg-blue-800"; // Dark Blue for Rain
      case "Snow":
        return "bg-blue-200"; // Light Blue for Snow
      case "Thunderstorm":
        return "bg-purple-800"; // Dark Purple for Thunderstorm
      case "Drizzle":
      case "Mist":
      case "Haze":
      case "Fog":
        return "bg-gray-400"; // Light Gray for Misty/Foggy
      default:
        return "bg-blue-600"; // Moderate Blue as Fallback
    }
  };

  return (
    <div className={`h-auto w-full ${getBackgroundColor()} transition-colors duration-500 overflow-auto`}>
      <nav className="w-full">
      <AppName />
      {/* Other navbar elements */}
    </nav>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar recentSearches={recentSearches} onSearch={fetchWeather} />

        {/* Main Content */}
        <div className="flex-grow p-6 overflow-auto">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={() => fetchWeather(query)}
            onLiveLocation={fetchLiveLocationWeather}
          />

          {loading ? (
            <p className="text-center text-white mt-4">Loading...</p>
          ) : (
            weatherData && (
              <>
                {/* Weather Card */}
                <WeatherCard weather={weatherData} />
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
