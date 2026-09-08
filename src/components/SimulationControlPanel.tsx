'use client';
import React from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function SimulationControlPanel() {
  const store = usemyhealthStore();

  if (store.globalMode !== 'SIMULATION') return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 px-2 text-white overflow-x-auto w-full md:w-auto no-scrollbar">
          <span className="text-[10px] font-black tracking-widest text-slate-400 mr-2 shrink-0">SCENARIO</span>
          {[
            'MODE_1_NORMAL', 'MODE_2_EXERCISE', 'MODE_3_STATIONARY_HIGH_HR', 'MODE_4_HEAT_EXPOSURE',
            'MODE_5_HEAT_EXERTION', 'MODE_6_DEHYDRATION', 'MODE_7_RESPIRATORY_RISK', 'MODE_8_LOW_SPO2',
            'MODE_9_FATIGUE', 'MODE_10_FALL', 'MODE_11_FALL_NORMAL_VITALS', 'MODE_12_MICROCLIMATE',
            'MODE_13_EXTREME_WEATHER', 'MODE_14_HEATWAVE', 'MODE_15_FLOOD', 'MODE_16_CYCLONE',
            'MODE_17_OFFLINE', 'MODE_18_STALE_API', 'MODE_19_SENSOR_FAILURE', 'MODE_20_CASCADE',
            'MODE_21_RECOVERY'
          ].map(sc => (
            <button
              key={sc}
              onClick={() => store.setScenario(sc as any)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all uppercase ${
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
            onClick={() => store.setScenario('MODE_1_NORMAL')}
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
  );
}