"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from "lucide-react";

export function WeatherWidget({ location }: { location: string }) {
  const [weather, setWeather] = useState<{ temp: number; condition: string; humidity: number; wind: number } | null>(null);

  useEffect(() => {
    // Simulated weather data based on location
    // In a real app, this would call an API like OpenWeatherMap
    setTimeout(() => {
      setWeather({
        temp: 32,
        condition: "Sunny",
        humidity: 65,
        wind: 12
      });
    }, 1000);
  }, [location]);

  if (!weather) return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 animate-pulse">
      <div className="h-4 w-24 bg-stone-100 rounded mb-4" />
      <div className="h-8 w-16 bg-stone-100 rounded" />
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold mb-1">Local Weather</p>
          <p className="text-sm font-bold">{location}</p>
        </div>
        <Sun className="w-8 h-8 text-yellow-300" />
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl font-bold font-display">{weather.temp}°C</span>
        <div className="h-8 w-px bg-white/20" />
        <span className="text-sm font-medium">{weather.condition}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-white/80">
          <Droplets className="w-4 h-4" />
          <span className="text-xs">{weather.humidity}% Hum</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Wind className="w-4 h-4" />
          <span className="text-xs">{weather.wind} km/h</span>
        </div>
      </div>
    </div>
  );
}
