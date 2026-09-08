'use client';
import React from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { ShieldAlert, MapPin, Radio, AlertTriangle, Info } from 'lucide-react';

export default function DisasterIntelligencePage() {
  const store = usemyhealthStore();

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-blue-600" /> 
          DISASTER INTELLIGENCE
        </h1>
        <p className="text-slate-500 mt-1">Local sensor fusion correlated with external hazard intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Status & Confidence */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-xl border shadow-sm ${store.derived.hazard === 'HIGH' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
             <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold uppercase tracking-wider text-slate-500">Current Hazard</div>
                <Radio className={`w-5 h-5 ${store.derived.hazard === 'HIGH' ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
             </div>
             <div className={`text-3xl font-black mb-2 ${store.derived.hazard === 'HIGH' ? 'text-rose-700' : 'text-emerald-700'}`}>
               {store.derived.hazard === 'HIGH' ? 'HAZARD DETECTED' : 'NO ACTIVE HAZARDS'}
             </div>
             {store.derived.hazard === 'HIGH' && (
               <div className="text-sm font-semibold text-rose-600 bg-rose-100 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4" /> Airborne Gas Detected
               </div>
             )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Hazard Confidence Matrix</div>
             
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-semibold text-slate-700">Local Sensor Confirmation</span>
                   <span className="text-emerald-600 font-bold">100%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-semibold text-slate-700">External API Warning (Sim)</span>
                   <span className="text-slate-500 font-bold">N/A</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                 </div>
               </div>

               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-semibold text-slate-700">Overall Confidence</span>
                   <span className="text-blue-600 font-bold">{store.derived.hazardConfidence}%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${store.derived.hazardConfidence}%` }}></div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Interactive Map Placeholder & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-96 relative flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 z-10">
               <div className="font-bold text-slate-700 flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-blue-500" />
                 Local Hazard Radius
               </div>
               <span className="text-xs font-semibold px-2 py-1 bg-white rounded shadow-sm text-slate-500 border border-slate-200">Map UI Demo</span>
            </div>
            
            {/* Visual Map Simulation */}
            <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               
               {/* User Marker */}
               <div className="absolute z-20 flex flex-col items-center">
                 <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>
                 <span className="mt-1 text-[10px] font-bold bg-white px-1.5 py-0.5 rounded shadow text-slate-700">YOU</span>
               </div>
               
               {/* Hazard Zone */}
               {store.derived.hazard === 'HIGH' && (
                 <div className="absolute z-10 w-64 h-64 bg-rose-500 opacity-20 rounded-full animate-ping" style={{ marginLeft: '100px', marginTop: '-50px' }}></div>
               )}
               {store.derived.hazard === 'HIGH' && (
                 <div className="absolute z-10 w-64 h-64 bg-rose-500 opacity-10 rounded-full" style={{ marginLeft: '100px', marginTop: '-50px' }}></div>
               )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3">
             <Info className="w-5 h-5 text-blue-600 mt-0.5" />
             <div>
               <h4 className="font-bold text-blue-900">How this works</h4>
               <p className="text-sm text-blue-800 mt-1">
                 PRAANA correlates your local environmental sensors (like the MQ-2 gas sensor currently reading {Math.round(store.sensors.bme688.gasResistance)}ppm) 
                 with regional disaster APIs to reduce false alarms and increase hazard confidence. 
                 Real mapping APIs (like Mapbox) will be integrated here in future phases.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
