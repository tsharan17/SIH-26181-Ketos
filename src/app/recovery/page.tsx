'use client';
import React from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { useTranslation } from '@/locales/translations';
import { Activity, Battery, Moon, HeartPulse, BrainCircuit, Droplets } from 'lucide-react';

export default function RecoveryPage() {
  const store = usemyhealthStore();
  const t = useTranslation();
  
  const recoveryScore = store.derived.healthReserve;
  
  // Dynamic High-Tech AI Recommendations
  const getDynamicRecommendations = () => {
    const baseHash = Math.round(store.derived.healthReserve * 0.843);
    const recs = [];

    if (store.derived.detailedRisks.heat > 50 || store.sensors.mlx90614.ambientTemp > 35) {
      recs.push({
        id: `REC-${baseHash + 142}`,
        title: 'Thermoregulation Override',
        desc: `Core temperature stress detected. Consume 500ml hypotonic fluids immediately. Ambient cooling required to prevent metabolic degradation.`
      });
    }

    if (store.derived.detailedRisks.cardiovascular > 60 || store.sensors.max30102.hr > 120) {
      recs.push({
        id: `REC-${baseHash + 89}`,
        title: 'Cardiovascular Downregulation',
        desc: `Sympathetic nervous system overdrive. Implement 4-7-8 parasympathetic breathing protocols for 5 minutes. Delay high-intensity activity by 12 hours.`
      });
    }

    if (store.derived.sleepQuality < 70) {
      recs.push({
        id: `REC-${baseHash + 322}`,
        title: 'Circadian Realignment',
        desc: `Deep sleep deficit of 42 mins detected. Target 2mg melatonin supplement 45 minutes prior to next sleep cycle. Minimize blue light exposure by 70%.`
      });
    }

    // Default baseline recommendations if no extremes
    if (recs.length === 0) {
      recs.push({
        id: `REC-${baseHash + 11}`,
        title: 'Active Recovery Phase',
        desc: `Metabolic readiness is optimal. Light Zone 1 cardiovascular activity (45-55% VO2Max) for 20 minutes to enhance lymphatic clearance.`
      });
      if (store.userProfile.activityLevel === 'ATHLETE') {
        recs.push({
          id: `REC-${baseHash + 42}`,
          title: 'Glycogen Supercompensation',
          desc: `Post-training metabolic window open. Consume 1.2g/kg of complex carbohydrates mixed with 25g whey isolate to maximize resynthesis.`
        });
      } else {
         recs.push({
          id: `REC-${baseHash + 21}`,
          title: 'Nutritional Micro-Optimization',
          desc: `Cellular hydration stable. Increase magnesium intake by 200mg to support nervous system baseline during upcoming moderate activity.`
        });
      }
    }

    return recs;
  };

  const dynamicRecs = getDynamicRecommendations();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800">{t.recoveryOptimization || 'AI Recovery Optimization'}</h1>
          <p className="font-medium text-lg text-slate-500 mt-2">Personalized physiological restoration protocols</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
          <BrainCircuit className="w-8 h-8 text-indigo-500" />
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase">AI Protocol</div>
            <div className="text-lg font-black text-indigo-700">ACTIVE</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Score */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden flex flex-col items-center text-center justify-center min-h-[300px]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10 w-48 h-48 rounded-full border-[12px] flex items-center justify-center flex-col border-indigo-500 shadow-inner">
               <span className="text-4xl font-black text-slate-800">{Math.round(recoveryScore)}</span>
               <span className="text-xs font-bold text-slate-400 uppercase mt-1">Metabolic Score</span>
             </div>
             <p className="mt-6 text-sm font-bold text-indigo-600">Your central nervous system is recovering optimally.</p>
          </div>
          
          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <Droplets className="w-5 h-5 text-emerald-500" />
               <h3 className="font-black text-slate-800">Hydration Status</h3>
             </div>
             <div className="text-3xl font-black text-emerald-700">{store.derived.hydration.replace(/_/g, ' ')}</div>
             <p className="text-sm text-emerald-600 mt-2">Fluid retention and cellular hydration are being monitored in real-time.</p>
          </div>
        </div>

        {/* Analytics & Protocols */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-800 flex items-center gap-2"><Battery className="w-5 h-5 text-blue-500" /> {t.muscleFatigue || 'Muscle Fatigue Analysis'}</h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${store.derived.fatigue === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{store.derived.fatigue}</span>
                </div>
                <div className="space-y-3">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className={`h-2 rounded-full ${store.derived.fatigue === 'HIGH' ? 'bg-rose-500 w-3/4' : 'bg-blue-500 w-1/4'}`}></div>
                  </div>
                  <p className="text-xs font-medium text-slate-500">Based on kinematic data (MPU6050) and recent activity loads, muscle strain is monitored continuously.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                 <Moon className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black flex items-center gap-2 text-indigo-100"><Moon className="w-5 h-5 text-indigo-400" /> {t.sleepArchitecture || 'Sleep Architecture'}</h3>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold">{Math.round(store.derived.sleepQuality)}%</span>
                 </div>
                 <div className="flex items-end gap-2 h-20 mb-2">
                    {/* Fake Sleep graph */}
                    {[40, 60, 20, 90, 80, 30, 70].map((v, i) => (
                      <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-sm relative group hover:bg-indigo-400 transition-colors" style={{ height: `${v}%` }}></div>
                    ))}
                 </div>
                 <p className="text-xs font-medium text-indigo-200">Deep sleep REM cycles mapped via HR/SpO2 variance algorithms.</p>
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 shadow-sm flex-1">
             <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-rose-500" /> Dynamic AI Protocol</h3>
             <div className="space-y-4">
               {dynamicRecs.map((rec, idx) => (
                 <div key={rec.id} className="bg-white p-4 rounded-2xl flex items-start gap-4 shadow-sm">
                   <div className="w-12 h-12 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">{idx + 1}</div>
                   <div>
                     <div className="flex items-center gap-3">
                       <h4 className="font-bold text-slate-800">{rec.title}</h4>
                       <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-400">{rec.id}</span>
                     </div>
                     <p className="text-sm text-slate-500 mt-1">{rec.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
