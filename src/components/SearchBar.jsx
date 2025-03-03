import React, { useState, useEffect } from 'react';
import { MdLocationOn } from 'react-icons/md';
import { FiSun, FiMoon } from 'react-icons/fi';

const API_KEY = '84c0ee8a268dc9d02944341ba3109f0e';

const SearchBar = ({ query, setQuery, onSearch, onLiveLocation, theme, setTheme, unit, setUnit }) => {
  const [suggestions, setSuggestions] = useState([]);

  // Fetch location suggestions from OpenWeatherMap API
  const fetchSuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${API_KEY}`
      );
      const data = await response.json();
      setSuggestions(data.list || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <nav className="w-fullbg-sky-300 px-4 py-2 flex justify-between items-center">
      {/* Location & Search */}
      <div className="flex items-center gap-2 w-full max-w-2xl">
        <button
          type="button"
          onClick={onLiveLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          <MdLocationOn size={24} className="text-white" />
          <span className="text-sm">Location</span>
        </button>

        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-4 pr-4 py-2 w-full text-white bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
          />
        </div>

        {/* New "Search" Button */}
        <button 
          type="submit"
          onClick={(e) => { e.preventDefault(); onSearch(); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Search
        </button>

        {/* Auto-suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md z-50">
            {suggestions.map((city) => (
              <li
                key={city.id}
                className="p-2 text-black hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setQuery(city.name);
                  setSuggestions([]);
                }}
              >
                {city.name}, {city.sys.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Theme & Unit Switch */}
      <div className="flex items-center gap-4">
        {/* Day/Night Mode Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="text-xl p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {theme === 'light' ? <FiSun /> : <FiMoon />}
        </button>

        {/* Temperature Unit Toggle */}
        <button
          onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
          className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {unit === 'metric' ? '°C' : '°F'}
        </button>
      </div>
    </nav>
  );
};

export default SearchBar;
