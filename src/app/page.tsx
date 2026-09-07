'use client';
import React, { useState } from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { useTranslation } from '@/locales/translations';
import { CalibrationModal } from '@/components/CalibrationModal';
import { 
  Heart, Activity, Wind, Battery, ShieldAlert, 
  Play, Pause, RotateCcw, Flame, Footprints, AlertTriangle, 
  Network, Fingerprint, Clock, Dna, BrainCircuit, ScanEye, Zap, MapPin, Smile, Globe, Smartphone, Watch, Droplets, Database
} from 'lucide-react';

export default function MyHealthDashboard() {
  const store = usemyhealthStore();
  const t = useTranslation();
  
  const [showCapsule, setShowCapsule] = useState(false);
  const [showLogFeeling, setShowLogFeeling] = useState(false);
  const [feeling, setFeeling] = useState('CALM');

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

  const handleLogFeeling = () => {
    // Simulating sending to AI backend to update model
    store.updateState({ 
      derived: { 
        ...store.derived, 
        wellness: { ...store.derived.wellness, emotionalState: feeling as any }
      } 
    });
    setShowLogFeeling(false);
  };

  return (
    <div className={`relative min-h-screen pb-32 transition-colors duration-1000 ${isUltra ? 'bg-black text-slate-300' : ''}`}>
      <CalibrationModal />
      
      {/* Header Info */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${isUltra ? 'text-white' : 'text-slate-900'}`}>{t.dashboard}</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className={`font-medium text-lg ${isUltra ? 'text-slate-500' : 'text-slate-500'}`}>Advanced Physiological AI Monitoring</p>
            {isUltra && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-lg border border-yellow-500/30 animate-pulse">
                <Battery className="w-3 h-3" /> ULTRA SAVER MODE
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button 
            onClick={() => setShowCapsule(!showCapsule)}
            className={`px-5 py-3 rounded-2xl text-white font-black tracking-widest shadow-lg transition-all flex items-center gap-2 ${store.derived.meshNetworkActive ? 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20 animate-pulse' : 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/50'}`}
          >
            {store.derived.meshNetworkActive ? <Network className="w-5 h-5" /> : <Database className="w-5 h-5 text-rose-500" />}
            {store.derived.meshNetworkActive ? 'CAPSULE ACTIVE' : 'BLACK BOX'}
          </button>
          <div className={`px-6 py-3 border rounded-2xl text-white font-black tracking-widest text-lg shadow-xl bg-gradient-to-r ${getRiskGradient(store.derived.risk)}`}>
            {t.currentStatus}: {t[store.derived.risk.toLowerCase().replace(' ', '') as keyof typeof t] || store.derived.risk}
          </div>
        </div>
      </div>

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
        <div className="text-sm font-bold tracking-widest text-slate-400 mb-6 uppercase">{t.vitalSigns}</div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <SensorBadge name="MAX30102" label={t.heartRate} val={`${Math.round(store.sensors.max30102.hr)} BPM`} isUltra={isUltra} />
            <SensorBadge name="MLX90614" label={t.bodyTemp} val={`${store.sensors.mlx90614.ambientTemp.toFixed(1)}°C`} isUltra={isUltra} />
            <SensorBadge name="BME688" label={t.airQuality} val={`${Math.round(store.sensors.bme688.gasResistance)} Ω`} isUltra={isUltra} />
            <SensorBadge name="MPU6050" label="Kinematics" val={store.sensors.mpu6050.motion} isUltra={isUltra} />
          </div>
          
          <div className="px-4 text-slate-300"><Activity className="w-6 h-6" /></div>

          <div className={`shrink-0 w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center ${isUltra ? 'border-slate-800' : (store.derived.healthReserve > 7000 ? 'border-blue-500' : 'border-orange-500')}`}>
            <div className={`text-4xl font-black ${isUltra ? 'text-white' : 'text-slate-800'}`}>{Math.round(store.derived.healthReserve)}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.healthReserve}</div>
          </div>
        </div>
      </div>

      {/* Interactive Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        
        {/* Wellness Dashboard & Emotional Support */}
        <div className={`col-span-1 md:col-span-6 lg:col-span-6 flex flex-col gap-4`}>
          <div className={`flex-1 rounded-3xl p-6 shadow-sm border flex flex-col justify-between ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
             <div className="text-sm font-bold tracking-widest text-slate-400 mb-2 uppercase flex items-center justify-between">
               <span>{t.personalWellness}</span>
               <span className="text-emerald-500 font-black">{store.derived.wellness.gamifiedPoints} {t.points}</span>
             </div>
             
             <div className="space-y-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.userProfile?.gender === 'FEMALE' && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-3xl shadow-sm relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-200/50 rounded-full blur-2xl group-hover:bg-rose-300/50 transition-colors"></div>
                      <div className="relative z-10">
                        <div className="text-xs font-bold text-slate-500 flex items-center gap-2"><Droplets className="w-4 h-4 text-rose-400"/> {t.cycleTracking}</div>
                        <div className="mt-2 text-3xl font-black tracking-tight text-slate-800">{t.day} {store.derived.wellness.periodDay || 14}</div>
                        <div className="text-sm font-medium text-rose-600 mt-1">{t.ovulationWindow}</div>
                        <div className="mt-4 w-full bg-rose-200/50 rounded-full h-2 overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full" style={{ width: `${((store.derived.wellness.periodDay || 14)/28)*100}%` }}></div>
                        </div>
                      </div>
                    </div>
                )}
                
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl shadow-sm flex flex-col justify-between">
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-2"><Smile className="w-4 h-4 text-blue-400"/> {t.emotionState}</div>
                  <div className={`text-2xl mt-2 font-black ${isUltra ? 'text-white' : 'text-slate-800'}`}>{store.derived.wellness.emotionalState}</div>
                  <button onClick={() => setShowLogFeeling(true)} className="mt-4 w-full py-2 bg-white rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border border-blue-200">
                    {t.logFeeling}
                  </button>
                </div>
             </div>
          </div>
        </div>

        {/* Battery & Edge Privacy */}
        <div className="col-span-1 md:col-span-6 lg:col-span-6 flex flex-col gap-4">
           
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

      {/* Emergency Capsule / Black Box Modal */}
      {showCapsule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-2xl w-full shadow-[0_0_50px_rgba(225,29,72,0.15)] relative overflow-hidden">
            <button onClick={() => setShowCapsule(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                 {store.derived.meshNetworkActive ? <Network className="w-8 h-8 animate-pulse" /> : <Database className="w-8 h-8" />}
               </div>
               <div>
                 <h3 className="text-2xl font-black text-white">{store.derived.meshNetworkActive ? 'Emergency Mesh Capsule' : 'Local Black Box Data'}</h3>
                 <p className="text-sm font-bold text-rose-400 tracking-widest uppercase">
                   {store.derived.meshNetworkActive ? 'BROADCASTING VIA LORA/BLE' : 'ENCRYPTED EDGE STORAGE SECURED'}
                 </p>
               </div>
            </div>
            
            <div className="bg-black/50 rounded-2xl p-6 font-mono text-xs text-emerald-400 border border-slate-800 break-words shadow-inner overflow-y-auto max-h-[400px]">
               <div className="text-slate-500 mb-4 pb-2 border-b border-slate-800 flex justify-between">
                 <span>{`// DECRYPTED PAYLOAD LOG`}</span>
                 <span>SYS_TIME: {new Date().toISOString()}</span>
               </div>
               
               {store.derived.healthCapsule ? (
                 <pre className="whitespace-pre-wrap text-emerald-300">
                   {JSON.stringify(store.derived.healthCapsule, null, 2)}
                 </pre>
               ) : (
                 <div className="space-y-4">
                   <div className="text-blue-400"># Current System State (Black Box Recording)</div>
                   <div className="text-slate-300">
                     <div>HR_AVG_15M: {Math.round(store.sensors.max30102.hr)} BPM</div>
                     <div>SPO2_BASE: {Math.round(store.sensors.max30102.spo2)}%</div>
                     <div>CORE_TEMP_EST: {store.sensors.mlx90614.ambientTemp.toFixed(1)}°C</div>
                     <div>KINEMATIC_VECTOR: {store.sensors.mpu6050.motion}</div>
                   </div>
                   <div className="text-rose-400"># Cumulative Hazard Vectors</div>
                   <div className="text-slate-300">
                     <div>EXPOSURE_DEBT: {store.derived.exposureDebt.toFixed(2)}</div>
                     <div>BIOLOGICAL_OFFSET: {store.derived.biologicalAgeOffset.toFixed(2)} years</div>
                     <div>CIRCADIAN_SYNC: {store.derived.circadianSync.toFixed(2)}%</div>
                   </div>
                   <div className="text-emerald-400 mt-4 animate-pulse">_ Recording stable...</div>
                 </div>
               )}
            </div>

            <div className="mt-6 flex justify-between items-center border-t border-slate-800 pt-6">
              <div className="text-xs font-medium text-slate-400">
                {store.derived.meshNetworkActive ? 'Beaconing until battery depletes.' : 'Continuous local loop recording active.'}
              </div>
              <div className="px-3 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                ESP32-S3 SECURE ENCLAVE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Feeling Modal */}
      {showLogFeeling && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl relative">
            <h3 className="text-xl font-black text-slate-800 mb-4">{t.logFeeling}</h3>
            <div className="flex flex-col gap-3">
              {['CALM', 'STRESSED', 'OVERWHELMED', 'ENERGETIC'].map(f => (
                <button key={f} onClick={() => setFeeling(f)} className={`p-3 rounded-xl font-bold border ${feeling === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowLogFeeling(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
              <button onClick={handleLogFeeling} className="flex-1 py-3 bg-emerald-600 rounded-xl font-bold text-white shadow-lg">{t.updateModel}</button>
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
              {['NORMAL_DAY', 'SLEEPING', 'EXERCISE', 'HEAT_WAVE', 'POOR_AIR_QUALITY', 'FLOOD_WARNING', 'NETWORK_FAILURE', 'ULTRA_SAVER', 'FALL', 'DEHYDRATION', 'HEART_PALPITATION', 'HYPOTHERMIA'].map(sc => (
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

function SensorBadge({ name, label, val, isUltra }: { name: string; label: string; val: string | number; isUltra: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${isUltra ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="text-[10px] font-black text-slate-400 tracking-widest">{name}</div>
      <div className="text-[11px] font-semibold text-slate-500">{label}</div>
      <div className={`text-sm font-bold mt-1 ${isUltra ? 'text-white' : 'text-slate-700'}`}>{val}</div>
    </div>
  );
}
