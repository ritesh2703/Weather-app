import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const API_KEY = "84c0ee8a268dc9d02944341ba3109f0e"; // Replace with your OpenWeatherMap API Key

const HourlyGraph = ({ lat, lon }) => {
  const [hourlyData, setHourlyData] = useState([]);

  // Fetch 24-hour forecast data
  const fetchHourlyForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      // Extract next 24 hours
      const next24Hours = response.data.list.slice(0, 8); // 8 * 3 hours = 24 hours
      const hourly = next24Hours.map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp)
      }));

      // Add hourly intervals with 3-degree differences
      const detailedHourly = [];
      hourly.forEach((entry, i) => {
        detailedHourly.push(entry);
        if (i < hourly.length - 1) {
          const nextEntry = hourly[i + 1];
          const diff = Math.sign(nextEntry.temp - entry.temp) * 3;
          const nextTemp = entry.temp + diff;
          detailedHourly.push({
            time: entry.time.replace(':00', ':30'),
            temp: nextTemp
          });
        }
      });

      setHourlyData(detailedHourly);
    } catch (error) {
      console.error('Error fetching hourly forecast:', error);
    }
  };

  useEffect(() => {
    if (lat && lon) {
      fetchHourlyForecast();
    }
  }, [lat, lon]);

  return (
    <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-xl w-full max-w-4xl mb-8">
      <h3 className="text-2xl font-bold text-black text-center mb-4">24-Hour Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourlyData}>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickCount={8} interval="preserveEnd" />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyGraph;
