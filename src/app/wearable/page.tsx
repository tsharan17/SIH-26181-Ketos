'use client';
import React, { useEffect, useState } from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { Activity, Wind, HeartPulse, MapPin, Watch, Thermometer, Cloud } from 'lucide-react';

export default function LiveWearablePage() {
  const store = usemyhealthStore();
  const isUltra = store.derived.ultraSaverActive;

  // External Weather API State
  const [weather, setWeather] = useState({ temp: '--', aqi: '--', pressure: '--' });

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Fetch Temp and Pressure
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current=temperature_2m,surface_pressure');
        const weatherData = await weatherRes.json();
        
        // Fetch AQI
        const aqiRes = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=17.385&longitude=78.4867&current=european_aqi');
        const aqiData = await aqiRes.json();

        setWeather({
          temp: weatherData.current.temperature_2m,
          pressure: weatherData.current.surface_pressure,
          aqi: aqiData.current.european_aqi
        });
      } catch (error) {
        console.error("Failed to fetch external weather", error);
      }
    }
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`max-w-6xl mx-auto pb-12 transition-colors duration-1000 ${isUltra ? 'text-slate-300' : 'text-slate-900'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold tracking-tight flex items-center gap-3 ${isUltra ? 'text-white' : 'text-slate-900'}`}>
          <Watch className={`w-8 h-8 ${isUltra ? 'text-slate-500' : 'text-blue-600'}`} /> 
          PRAANA WEARABLE
        </h1>
        <p className={`mt-1 ${isUltra ? 'text-slate-500' : 'text-slate-500'}`}>Raw hardware data stream and external environmental metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: Cardiovascular Vitals */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isUltra ? 'bg-slate-800 text-rose-500' : 'bg-rose-50 text-rose-500'}`}>
                <HeartPulse className="w-5 h-5" />
              </div>
              <h2 className={`font-bold text-sm ${isUltra ? 'text-white' : 'text-slate-800'}`}>Cardiovascular Vitals</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase bg-emerald-500/20 text-emerald-500`}>
              LIVE
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Heart Rate</div>
              <div className="font-mono text-3xl font-black">{Math.round(store.sensors.max30102.hr)} <span className="text-sm font-sans text-slate-500">BPM</span></div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Blood Oxygen (SpO2)</div>
              <div className="font-mono text-3xl font-black">{Math.round(store.sensors.max30102.spo2)} <span className="text-sm font-sans text-slate-500">%</span></div>
            </div>
          </div>
        </div>

        {/* CARD 2: Local Environment */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isUltra ? 'bg-slate-800 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                <Thermometer className="w-5 h-5" />
              </div>
              <h2 className={`font-bold text-sm ${isUltra ? 'text-white' : 'text-slate-800'}`}>Local Environment</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase bg-emerald-500/20 text-emerald-500`}>
              LIVE
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Ambient Temperature</div>
              <div className="font-mono text-3xl font-black">{store.sensors.mlx90614.ambientTemp.toFixed(1)} <span className="text-sm font-sans text-slate-500">°C</span></div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Local Humidity</div>
              <div className="font-mono text-3xl font-black">{Math.round(store.sensors.bme688.humidity)} <span className="text-sm font-sans text-slate-500">%</span></div>
            </div>
          </div>
        </div>

        {/* CARD 3: External Weather (API) */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isUltra ? 'bg-slate-800 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                <Cloud className="w-5 h-5" />
              </div>
              <h2 className={`font-bold text-sm ${isUltra ? 'text-white' : 'text-slate-800'}`}>External Weather & Air</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase bg-blue-500/20 text-blue-500`}>
              CLOUD API
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Outdoor Temperature</div>
              <div className="font-mono text-2xl font-black">{weather.temp} <span className="text-sm font-sans text-slate-500">°C</span></div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Air Quality (AQI)</div>
              <div className="font-mono text-2xl font-black">{weather.aqi} <span className="text-sm font-sans text-slate-500"></span></div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Atmospheric Pressure</div>
              <div className="font-mono text-xl font-black">{weather.pressure} <span className="text-sm font-sans text-slate-500">hPa</span></div>
            </div>
          </div>
        </div>

        {/* CARD 4: Kinematics & Fall Detection */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isUltra ? 'bg-slate-800 text-indigo-500' : 'bg-indigo-50 text-indigo-600'}`}>
                <Activity className="w-5 h-5" />
              </div>
              <h2 className={`font-bold text-sm ${isUltra ? 'text-white' : 'text-slate-800'}`}>Kinematics & Fall</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase bg-emerald-500/20 text-emerald-500`}>
              LIVE
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Detected Motion State</div>
              <div className={`font-mono text-xl font-black p-3 rounded-lg mt-2 text-center ${store.sensors.mpu6050.motion === 'FALL_DETECTED' ? 'bg-rose-500 text-white animate-pulse' : (isUltra ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-800')}`}>
                {store.sensors.mpu6050.motion.replace('_', ' ')}
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-200/20">
              <div className="text-xs font-semibold text-slate-400">Risk Assessment: {store.sensors.mpu6050.motion === 'FALL_DETECTED' ? 'CRITICAL' : 'NOMINAL'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
