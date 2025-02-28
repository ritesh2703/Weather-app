import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

const Sidebar = ({ recentSearches, onSearch }) => {
  return (
    <div className="w-64 bg-orange-500 text-white p-4">
      <h3 className="text-lg mb-4">Recent Searches:</h3>
      <ul>
        {recentSearches.map((city, index) => (
          <li key={index} className="flex justify-between items-center">
            <button 
              onClick={() => onSearch(city)}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-md w-full text-left px-4 py-2 mb-2"
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
