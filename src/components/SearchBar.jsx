import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';

const API_KEY = '84c0ee8a268dc9d02944341ba3109f0e';

const SearchBar = ({ query, setQuery, onSearch, onLiveLocation }) => {
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
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="flex items-center mb-4 w-full max-w-2xl relative"
      >
        <button
          type="button"
          onClick={onLiveLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md"
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
            className="pl-4 pr-10 py-2 w-full text-black bg-white border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            <BsSearch size={20} />
          </button>
        </div>

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
      </form>
    </div>
  );
};

export default SearchBar;
