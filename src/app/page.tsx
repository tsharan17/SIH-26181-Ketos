'use client';
import React, { useState } from 'react';
import { usePraanaStore } from '@/store/usePraanaStore';
import { 
  Heart, Activity, Wind, Battery, ShieldAlert, 
  Play, Pause, RotateCcw, Flame, Footprints, AlertTriangle, 
  Network, Fingerprint, Clock, Dna, BrainCircuit, ScanEye, Zap, MapPin, Smile, Globe, Smartphone, Watch, Droplets
} from 'lucide-react';
import Link from 'next/link';

export default function MyHealthDashboard() {
  const store = usePraanaStore();
  const [showCapsule, setShowCapsule] = useState(false);

  const getRiskGradient = (risk: string) => {
    if (store.derived.ultraSaverActive) return 'from-slate-800 to-black border-slate-600 shadow-slate-900/50';
    switch(risk) {
      case 'SAFE': return 'from-emerald-400 to-teal-500 shadow-emerald-500/20';
      case 'CAUTION': return 'from-amber-400 to-orange-500 shadow-amber-500/20';
      case 'HIGH RISK': return 'from-orange-500 to-rose-500 shadow-orange-500/20';
      case 'EMERGENCY': return 'from-rose-600 to-red-600 shadow-red-500/30 animate-pulse';
      default: return 'from-slate-400 to-slate-500 shadow-slate-500/20';
    }
  };

  const isUltra = store.derived.ultraSaverActive;

  return (
    <div className={`relative min-h-screen pb-32 transition-colors duration-1000 ${isUltra ? 'bg-black text-slate-300' : ''}`}>
      
      {/* Header Info */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${isUltra ? 'text-white' : 'text-slate-900'}`}>Overview</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className={`font-medium text-lg ${isUltra ? 'text-slate-500' : 'text-slate-500'}`}>Your personalized health intelligence</p>
            {isUltra && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-lg border border-yellow-500/30 animate-pulse">
                <Battery className="w-3 h-3" /> ULTRA SAVER MODE
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button className={`p-3 rounded-full transition-all ${isUltra ? 'bg-slate-800 text-slate-400' : 'bg-white shadow-sm text-slate-400 hover:text-slate-800'}`}>
            <Globe className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setShowCapsule(!showCapsule)}
            className={`px-5 py-3 rounded-2xl text-white font-black tracking-widest shadow-lg transition-all flex items-center gap-2 ${store.derived.meshNetworkActive ? 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20 animate-pulse' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}
          >
            {store.derived.meshNetworkActive ? <Network className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {store.derived.meshNetworkActive ? 'MESH SOS ACTIVE' : 'SOS'}
          </button>
          <div className={`px-6 py-3 border rounded-2xl text-white font-black tracking-widest text-lg shadow-xl bg-gradient-to-r ${getRiskGradient(store.derived.risk)}`}>
            STATUS: {store.derived.risk}
          </div>
        </div>
      </div>

      {/* Adaptive Question Widget */}
      {store.derived.adaptiveQuestion && !isUltra && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between shadow-sm animate-fade-in-down">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Smile className="w-5 h-5" /></div>
             <div>
               <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">Health Mirror</div>
               <div className="text-blue-900 font-semibold">{store.derived.adaptiveQuestion}</div>
             </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">I'm fine</button>
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white shadow-sm hover:bg-blue-700">Log Symptom</button>
          </div>
        </div>
      )}

      {/* Actionable Recommendation (Hero) & Predictive Horizon */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`col-span-1 md:col-span-2 p-1 rounded-3xl shadow-sm border overflow-hidden relative group hover:shadow-md transition-all ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/60'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BrainCircuit className="w-48 h-48" />
          </div>
          <div className="p-8 relative z-10">
            <div className="text-sm font-bold tracking-widest text-blue-500 mb-2 uppercase flex items-center gap-2">
              <SparkleIcon /> Edge AI Recommendation
            </div>
            <h2 className={`text-2xl md:text-3xl font-black leading-tight max-w-3xl ${isUltra ? 'text-white' : 'text-slate-800'}`}>
              "{store.derived.recommendation}"
            </h2>
          </div>
        </div>

        <div className={`col-span-1 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group ${isUltra ? 'bg-black border border-slate-800' : 'bg-slate-900'}`}>
           <div className="absolute top-0 right-0 p-8 opacity-10">
             <ScanEye className="w-32 h-32" />
           </div>
           <div className="relative z-10 h-full flex flex-col justify-between">
             <div>
               <div className="text-sm font-bold tracking-widest text-indigo-400 mb-2 uppercase flex items-center gap-2">
                 <Clock className="w-4 h-4" /> Predictive Horizon
               </div>
               <h3 className="text-xl font-black leading-tight text-white mb-2">
                 {store.derived.predictiveHorizon}
               </h3>
             </div>
             <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4">
                <div className={`h-1.5 rounded-full ${store.derived.risk === 'SAFE' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} style={{ width: '65%' }}></div>
             </div>
           </div>
        </div>
      </div>

      {/* Multi-sensor Fusion & Health Reserve */}
      <div className={`mb-6 p-6 rounded-3xl border shadow-sm ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="text-sm font-bold tracking-widest text-slate-400 mb-6 uppercase">Multi-Sensor Fusion Pipeline</div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Sensors */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <SensorBadge name="MAX30102" val={`${Math.round(store.sensors.max30102.hr)} BPM`} isUltra={isUltra} />
            <SensorBadge name="MLX90614" val={`${store.sensors.mlx90614.ambientTemp.toFixed(1)}°C`} isUltra={isUltra} />
            <SensorBadge name="BME688" val={`${Math.round(store.sensors.bme688.gasResistance)} Ω`} isUltra={isUltra} />
            <SensorBadge name="MPU6050" val={store.sensors.mpu6050.motion} isUltra={isUltra} />
          </div>
          
          <div className="px-4 text-slate-300"><Play className="w-6 h-6" /></div>

          {/* Reserve */}
          <div className={`shrink-0 w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center ${isUltra ? 'border-slate-800' : (store.derived.healthReserve > 70 ? 'border-blue-500' : 'border-orange-500')}`}>
            <div className={`text-4xl font-black ${isUltra ? 'text-white' : 'text-slate-800'}`}>{Math.round(store.derived.healthReserve)}%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Reserve</div>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        
        {/* Personal Hazard Response Map */}
        <div className={`col-span-1 md:col-span-6 lg:col-span-4 rounded-3xl p-6 shadow-sm border relative overflow-hidden group ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="text-sm font-bold tracking-widest text-slate-400 mb-4 uppercase flex items-center justify-between">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Hazard Response Map</span>
          </div>
          <div className={`w-full h-48 rounded-xl relative overflow-hidden flex items-center justify-center ${isUltra ? 'bg-black' : 'bg-slate-100'}`}>
            {/* Map styling */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
            <div className="absolute z-20 flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>
            </div>
            {store.derived.hazard === 'HIGH' && (
              <div className="absolute z-10 w-32 h-32 bg-rose-500 opacity-20 rounded-full animate-ping" style={{ marginLeft: '60px', marginTop: '-30px' }}></div>
            )}
          </div>
          <div className="mt-4 text-xs font-semibold text-slate-500 flex justify-between">
            <span>Prediction Source:</span>
            <span className="text-blue-500 font-bold">{store.derived.disasterPredictionSource}</span>
          </div>
        </div>

        {/* Wellness Dashboard & Emotional Support */}
        <div className={`col-span-1 md:col-span-6 lg:col-span-4 flex flex-col gap-4`}>
          <div className={`flex-1 rounded-3xl p-6 shadow-sm border flex flex-col justify-between ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
             <div className="text-sm font-bold tracking-widest text-slate-400 mb-2 uppercase flex items-center justify-between">
               <span>Personal Wellness</span>
               <span className="text-emerald-500 font-black">{store.derived.wellness.gamifiedPoints} pts</span>
             </div>
             
             <div className="space-y-4 mt-2">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-2"><Droplets className="w-4 h-4 text-rose-400"/> Cycle tracking</div>
                  <div className={`text-sm font-black ${isUltra ? 'text-white' : 'text-slate-800'}`}>Day {store.derived.wellness.periodDay}</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                   <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: `${(store.derived.wellness.periodDay || 0)/28 * 100}%` }}></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-2"><Smile className="w-4 h-4 text-blue-400"/> Emotion state</div>
                  <div className={`text-sm font-black ${isUltra ? 'text-white' : 'text-slate-800'}`}>{store.derived.wellness.emotionalState}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Battery & Edge Privacy */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 flex flex-col gap-4">
           
           <div className={`rounded-3xl p-6 shadow-sm border flex justify-between items-center ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
             <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${store.sensors.phoneBattery < 20 ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-600'}`}><Smartphone className="w-6 h-6" /></div>
               <div>
                 <div className="text-xs font-bold text-slate-400">PHONE</div>
                 <div className={`text-xl font-black ${isUltra ? 'text-white' : 'text-slate-800'}`}>{Math.round(store.sensors.phoneBattery)}%</div>
               </div>
             </div>
             <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${store.sensors.battery < 20 ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-600'}`}><Watch className="w-6 h-6" /></div>
               <div>
                 <div className="text-xs font-bold text-slate-400">WEARABLE</div>
                 <div className={`text-xl font-black ${isUltra ? 'text-white' : 'text-slate-800'}`}>{Math.round(store.sensors.battery)}%</div>
               </div>
             </div>
           </div>

           <div className="flex-1 bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group text-white">
             <div className="absolute -right-4 -top-4 opacity-20 group-hover:rotate-12 transition-transform">
               <Fingerprint className="w-32 h-32" />
             </div>
             <div className="relative z-10">
               <div className="text-sm font-bold tracking-widest text-slate-400 mb-2 uppercase flex items-center gap-2">
                 <Fingerprint className="w-4 h-4 text-emerald-400" /> Edge AI Privacy
               </div>
               <div className="text-lg font-bold leading-tight mb-2">
                 {store.derived.meshNetworkActive ? 'Operating on LoRa Mesh Network.' : 'Local Insights generated on-device.'}
               </div>
             </div>
           </div>

        </div>

      </div>

      {/* Emergency Capsule Modal */}
      {showCapsule && store.derived.healthCapsule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-black border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowCapsule(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-500 animate-pulse">
                 <Network className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-xl font-black text-white">Emergency Capsule</h3>
                 <p className="text-xs font-bold text-rose-400">BROADCASTING VIA LORA/BLE</p>
               </div>
            </div>
            
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 border border-slate-800 break-words">
               <span className="text-slate-500">{`// ENCRYPTED EMERGENCY PACKET`}</span><br/>
               {JSON.stringify(store.derived.healthCapsule, null, 2)}
            </div>

            <div className="mt-6 text-xs font-medium text-slate-400 text-center">
              Stored locally on ESP32-S3. Beaconing until battery depletes.
            </div>
          </div>
        </div>
      )}


      {/* Floating Simulation Control Dock */}
      {store.globalMode === 'SIMULATION' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-4xl">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-2 text-white overflow-x-auto w-full md:w-auto no-scrollbar">
              <span className="text-[10px] font-black tracking-widest text-slate-400 mr-2 shrink-0">SCENARIO</span>
              {['NORMAL_DAY', 'SLEEPING', 'EXERCISE', 'HEAT_WAVE', 'POOR_AIR_QUALITY', 'FLOOD_WARNING', 'NETWORK_FAILURE', 'FALL'].map(sc => (
                <button
                  key={sc}
                  onClick={() => store.setScenario(sc as any)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    store.scenario === sc ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sc.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 shrink-0 bg-slate-800 p-1 rounded-2xl">
              <button 
                onClick={store.toggleSimulation}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  store.simulationState === 'PLAYING' 
                    ? 'bg-amber-500 text-amber-950 shadow-lg shadow-amber-500/20' 
                    : 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20'
                }`}
              >
                {store.simulationState === 'PLAYING' ? <Pause className="w-5 h-5 fill-current"/> : <Play className="w-5 h-5 fill-current"/>}
              </button>
              <button 
                onClick={() => store.setScenario('NORMAL_DAY')}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
              >
                <RotateCcw className="w-4 h-4"/>
              </button>
              
              <div className="flex items-center gap-1 pl-2 pr-1 border-l border-slate-700 ml-1">
                {[1, 10, 30].map(s => (
                  <button 
                    key={s}
                    onClick={() => store.setSimulationSpeed(s)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                      store.simulationSpeed === s ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}

function SensorBadge({ name, val, isUltra }: { name: string; val: string | number; isUltra: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${isUltra ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="text-[10px] font-black text-slate-400 tracking-widest">{name}</div>
      <div className={`text-sm font-bold mt-1 ${isUltra ? 'text-white' : 'text-slate-700'}`}>{val}</div>
    </div>
  );
}
