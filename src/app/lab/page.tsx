'use client';
import React, { useState } from 'react';
import { usePraanaStore } from '@/store/usePraanaStore';
import { 
  Database, Activity, Network, UserCheck, 
  ShieldAlert, Stethoscope, ChevronRight 
} from 'lucide-react';

const pipelineStages = [
  { id: 'sense', name: 'SENSE', icon: Database, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'understand', name: 'UNDERSTAND', icon: Network, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'personalize', name: 'PERSONALIZE', icon: UserCheck, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
  { id: 'predict', name: 'PREDICT', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
  { id: 'action', name: 'ACTION', icon: Stethoscope, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

export default function ModelLabPage() {
  const store = usePraanaStore();
  const [activeStage, setActiveStage] = useState('sense');
  const isUltra = store.derived.ultraSaverActive;

  const renderStageContent = () => {
    switch (activeStage) {
      case 'sense':
        return (
          <div className="space-y-4">
            <h3 className={`font-bold text-lg ${isUltra ? 'text-white' : 'text-slate-800'}`}>Raw Sensor Ingestion & Filtering</h3>
            <p className={isUltra ? 'text-slate-400 text-sm' : 'text-slate-600 text-sm'}>Data arrives from local ESP32-S3 hardware or the simulation engine and undergoes immediate noise rejection.</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className={`p-4 rounded-lg border ${isUltra ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-xs font-bold text-slate-400 mb-1">MAX30102 (HR/SpO2)</div>
                <div className={`font-mono text-sm ${isUltra ? 'text-white' : 'text-slate-800'}`}>{Math.round(store.sensors.max30102.hr)} BPM, {Math.round(store.sensors.max30102.spo2)}%</div>
                <div className="mt-2 text-xs text-emerald-600 font-semibold">Valid Packet</div>
              </div>
              <div className={`p-4 rounded-lg border ${isUltra ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-xs font-bold text-slate-400 mb-1">BME688 (Gas/Hum/Press)</div>
                <div className={`font-mono text-sm ${isUltra ? 'text-white' : 'text-slate-800'}`}>{Math.round(store.sensors.bme688.gasResistance)}Ω, {Math.round(store.sensors.bme688.humidity)}%</div>
                <div className="mt-2 text-xs text-emerald-600 font-semibold">Valid Packet</div>
              </div>
            </div>
          </div>
        );
      case 'understand':
        return (
          <div className="space-y-4">
            <h3 className={`font-bold text-lg ${isUltra ? 'text-white' : 'text-slate-800'}`}>Sensor Fusion & Context</h3>
            <p className={isUltra ? 'text-slate-400 text-sm' : 'text-slate-600 text-sm'}>Multiple sensor vectors are combined to understand the user's current situational context.</p>
            <div className={`p-4 rounded-lg border ${isUltra ? 'bg-indigo-900/30 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
              <div className={`text-sm font-bold mb-2 ${isUltra ? 'text-indigo-400' : 'text-indigo-800'}`}>Detected Context Engine Output</div>
              <div className={`text-2xl font-black ${isUltra ? 'text-white' : 'text-indigo-900'}`}>{store.derived.context}</div>
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded font-semibold ${isUltra ? 'bg-indigo-900 text-indigo-300' : 'bg-white text-indigo-600'}`}>Motion: {store.sensors.mpu6050.motion}</span>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${isUltra ? 'bg-indigo-900 text-indigo-300' : 'bg-white text-indigo-600'}`}>HR Range: {store.sensors.max30102.hr > 100 ? 'Elevated' : 'Normal'}</span>
              </div>
            </div>
          </div>
        );
      case 'personalize':
        return (
          <div className="space-y-4">
            <h3 className={`font-bold text-lg ${isUltra ? 'text-white' : 'text-slate-800'}`}>Personal Self Model</h3>
            <p className={isUltra ? 'text-slate-400 text-sm' : 'text-slate-600 text-sm'}>Current conditions are compared against the learned personal baseline of the user.</p>
            <div className="space-y-3">
               <div className={`flex justify-between items-center p-3 border rounded-lg ${isUltra ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                 <span className={`text-sm font-semibold ${isUltra ? 'text-slate-300' : 'text-slate-600'}`}>Heart Rate Baseline Deviation</span>
                 <span className={`text-sm font-bold ${store.sensors.max30102.hr > 85 ? 'text-rose-500' : 'text-emerald-500'}`}>
                   {store.sensors.max30102.hr > 85 ? `+${Math.round(store.sensors.max30102.hr - 75)} BPM` : 'Normal'}
                 </span>
               </div>
               <div className={`flex justify-between items-center p-3 border rounded-lg ${isUltra ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                 <span className={`text-sm font-semibold ${isUltra ? 'text-slate-300' : 'text-slate-600'}`}>Recovery Profile</span>
                 <span className="text-sm font-bold text-emerald-500">{store.derived.recovery}</span>
               </div>
               <div className={`flex justify-between items-center p-3 border rounded-lg ${isUltra ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                 <span className={`text-sm font-semibold ${isUltra ? 'text-slate-300' : 'text-slate-600'}`}>Biological Age Offset</span>
                 <span className={`text-sm font-bold ${store.derived.biologicalAgeOffset > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                   {store.derived.biologicalAgeOffset.toFixed(1)} Years
                 </span>
               </div>
            </div>
          </div>
        );
      case 'predict':
        return (
          <div className="space-y-4">
            <h3 className={`font-bold text-lg ${isUltra ? 'text-white' : 'text-slate-800'}`}>Hazard & Risk Assessment</h3>
            <p className={isUltra ? 'text-slate-400 text-sm' : 'text-slate-600 text-sm'}>Combines the personal state with environmental factors to generate conceptual resilience scores and risk levels.</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className={`p-4 rounded-lg border text-center ${isUltra ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="text-xs font-bold text-slate-400 mb-1">HEALTH RESERVE</div>
                <div className={`text-3xl font-black ${isUltra ? 'text-white' : 'text-slate-800'}`}>{Math.round(store.derived.healthReserve)}%</div>
              </div>
              <div className={`p-4 rounded-lg border text-center ${isUltra ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="text-xs font-bold text-slate-400 mb-1">PERSONAL RISK</div>
                <div className={`text-xl font-black mt-2 ${store.derived.risk === 'SAFE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {store.derived.risk}
                </div>
              </div>
            </div>
          </div>
        );
      case 'action':
        return (
          <div className="space-y-4">
            <h3 className={`font-bold text-lg ${isUltra ? 'text-white' : 'text-slate-800'}`}>Recommendation Engine</h3>
            <p className={isUltra ? 'text-slate-400 text-sm' : 'text-slate-600 text-sm'}>Actionable advice generated from the predictive layer.</p>
            <div className={`p-5 rounded-lg border ${isUltra ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className={`font-bold mb-1 ${isUltra ? 'text-emerald-400' : 'text-emerald-900'}`}>Generated Recommendation</div>
              <div className={isUltra ? 'text-emerald-100' : 'text-emerald-800'}>{store.derived.recommendation}</div>
              <div className={`mt-3 text-xs opacity-80 border-t pt-2 ${isUltra ? 'text-emerald-300 border-emerald-500/30' : 'text-emerald-700 border-emerald-200'}`}>
                Horizon: {store.derived.predictiveHorizon}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-6xl mx-auto pb-12 transition-colors duration-1000 ${isUltra ? 'text-slate-300' : 'text-slate-900'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold tracking-tight flex items-center gap-3 ${isUltra ? 'text-white' : 'text-slate-900'}`}>
          <Activity className={`w-8 h-8 ${isUltra ? 'text-slate-500' : 'text-blue-600'}`} /> 
          MODEL LAB
        </h1>
        <p className={`mt-1 ${isUltra ? 'text-slate-500' : 'text-slate-500'}`}>Interactive visualization of the MY HEALTH intelligence pipeline</p>
      </div>

      <div className={`rounded-xl border shadow-sm p-6 overflow-hidden ${isUltra ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        {/* Pipeline Navigator */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 relative">
          <div className={`absolute left-0 right-0 top-1/2 h-1 -z-10 hidden md:block transform -translate-y-1/2 ${isUltra ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
          
          {pipelineStages.map((stage, idx) => {
            const isActive = activeStage === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <button 
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex flex-col items-center gap-2 relative transition-all ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                >
                  <div className={`p-4 rounded-2xl border-2 ${isUltra ? 'bg-slate-900' : 'bg-white'} ${isActive ? stage.border : (isUltra ? 'border-slate-800' : 'border-slate-200')} shadow-sm transition-colors`}>
                    <stage.icon className={`w-6 h-6 ${isActive ? stage.color : 'text-slate-400'}`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest ${isActive ? (isUltra ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>
                    {stage.name}
                  </span>
                </button>
                {idx < pipelineStages.length - 1 && (
                  <ChevronRight className={`w-5 h-5 hidden md:block z-10 ${isUltra ? 'text-slate-600 bg-slate-900' : 'text-slate-300 bg-white'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Content Area */}
        <div className={`border rounded-xl p-8 min-h-[300px] ${isUltra ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
           {renderStageContent()}
        </div>

      </div>
    </div>
  );
}
