import React from 'react';
import Cloud from "../assets/cloud.jpeg"; // ✅ Import local image

const AppName = () => {
  return (
    <div 
      className="flex items-center justify-center h-24 w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${Cloud})` }} // ✅ Use dynamic URL
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-sky-500/70 bg-opacity-30"></div>

      {/* App Name */}
      <h1 className="text-4xl font-bold text-white drop-shadow-lg relative">
        Weather App
      </h1>
    </div>
  );
};

export default AppName;
