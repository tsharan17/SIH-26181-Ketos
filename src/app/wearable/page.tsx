'use client';
import React from 'react';
import { usePraanaStore } from '@/store/usePraanaStore';
import { Activity, Wind, HeartPulse, Droplets, MapPin, Watch, Smartphone, Thermometer } from 'lucide-react';

export default function LiveWearablePage() {
  const store = usePraanaStore();
  const isUltra = store.derived.ultraSaverActive;

  return (
    <div className={`max-w-6xl mx-auto pb-12 transition-colors duration-1000 ${isUltra ? 'text-slate-300' : 'text-slate-900'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold tracking-tight flex items-center gap-3 ${isUltra ? 'text-white' : 'text-slate-900'}`}>
          <Watch className={`w-8 h-8 ${isUltra ? 'text-slate-500' : 'text-blue-600'}`} /> 
          MY HEALTH WEARABLE
        </h1>
        <p className={`mt-1 ${isUltra ? 'text-slate-500' : 'text-slate-500'}`}>Raw hardware data stream from ESP32-S3</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* MAX30102 */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isUltra ? 'bg-slate-800 text-rose-500' : 'bg-rose-50 text-rose-500'}`}>
                <HeartPulse className="w-5 h-5" />
              </div>
              <h2 className={`font-bold ${isUltra ? 'text-white' : 'text-slate-800'}`}>MAX30102</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${store.sensors.max30102.status === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
              {store.sensors.max30102.status}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Heart Rate</div>
              <div className="font-mono text-3xl font-black">{Math.round(store.sensors.max30102.hr)} <span className="text-sm font-sans text-slate-500">BPM</span></div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">SpO2</div>
              <div className="font-mono text-3xl font-black">{Math.round(store.sensors.max30102.spo2)} <span className="text-sm font-sans text-slate-500">%</span></div>
            </div>
            <div className="pt-4 border-t border-slate-200/20">
              <div className="text-xs font-semibold text-slate-400">Signal Confidence: {store.sensors.max30102.confidence}%</div>
            </div>
          </div>
        </div>

        {/* MLX90614 */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isUltra ? 'bg-slate-800 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                <Thermometer className="w-5 h-5" />
              </div>
              <h2 className={`font-bold ${isUltra ? 'text-white' : 'text-slate-800'}`}>MLX90614</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${store.sensors.mlx90614.status === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
              {store.sensors.mlx90614.status}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Ambient Temp</div>
              <div className="font-mono text-3xl font-black">{store.sensors.mlx90614.ambientTemp.toFixed(1)} <span className="text-sm font-sans text-slate-500">°C</span></div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Body Temp</div>
              <div className="font-mono text-3xl font-black">{store.sensors.mlx90614.bodyTemp.toFixed(1)} <span className="text-sm font-sans text-slate-500">°C</span></div>
            </div>
            <div className="pt-4 border-t border-slate-200/20">
              <div className="text-xs font-semibold text-slate-400">Signal Confidence: {store.sensors.mlx90614.confidence}%</div>
            </div>
          </div>
        </div>

        {/* BME688 */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isUltra ? 'bg-slate-800 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                <Wind className="w-5 h-5" />
              </div>
              <h2 className={`font-bold ${isUltra ? 'text-white' : 'text-slate-800'}`}>BME688</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${store.sensors.bme688.status === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
              {store.sensors.bme688.status}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Gas Resistance (AQI Base)</div>
              <div className="font-mono text-3xl font-black">{Math.round(store.sensors.bme688.gasResistance)} <span className="text-sm font-sans text-slate-500">Ω</span></div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Humidity</div>
              <div className="font-mono text-3xl font-black">{Math.round(store.sensors.bme688.humidity)} <span className="text-sm font-sans text-slate-500">%</span></div>
            </div>
            <div className="pt-4 border-t border-slate-200/20">
              <div className="text-xs font-semibold text-slate-400">Pressure: {store.sensors.bme688.pressure} hPa</div>
            </div>
          </div>
        </div>

        {/* MPU6050 */}
        <div className={`p-6 rounded-2xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isUltra ? 'bg-slate-800 text-indigo-500' : 'bg-indigo-50 text-indigo-600'}`}>
                <Activity className="w-5 h-5" />
              </div>
              <h2 className={`font-bold ${isUltra ? 'text-white' : 'text-slate-800'}`}>MPU6050</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${store.sensors.mpu6050.status === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
              {store.sensors.mpu6050.status}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">Detected Motion State</div>
              <div className={`font-mono text-xl font-black p-3 rounded-lg mt-2 ${store.sensors.mpu6050.motion === 'FALL_DETECTED' ? 'bg-rose-500 text-white' : (isUltra ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-800')}`}>
                {store.sensors.mpu6050.motion}
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-200/20">
              <div className="text-xs font-semibold text-slate-400">6-Axis Fusion Confidence: {store.sensors.mpu6050.confidence}%</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
