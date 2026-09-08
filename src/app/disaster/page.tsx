'use client';
import React from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { ShieldAlert, MapPin, Radio, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from '@/locales/translations';

export default function DisasterIntelligencePage() {
  const store = usemyhealthStore();
  const t = useTranslation();

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-blue-600" /> 
          {t.disasterIntelligence || 'DISASTER INTELLIGENCE'}
        </h1>
        <p className="text-slate-500 mt-1">{t.disasterDesc || 'Local sensor fusion correlated with external hazard intelligence'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Status & Confidence */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-xl border shadow-sm ${store.derived.hazard === 'HIGH' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
             <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold uppercase tracking-wider text-slate-500">{t.currentHazard || 'Current Hazard'}</div>
                <Radio className={`w-5 h-5 ${store.derived.hazard === 'HIGH' ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
             </div>
             <div className={`text-3xl font-black mb-2 ${store.derived.hazard === 'HIGH' ? 'text-rose-700' : 'text-emerald-700'}`}>
               {store.derived.hazard === 'HIGH' ? (t.hazardDetected || 'HAZARD DETECTED') : (t.noActiveHazards || 'NO ACTIVE HAZARDS')}
             </div>
             {store.derived.hazard === 'HIGH' && (
               <div className="text-sm font-semibold text-rose-600 bg-rose-100 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4" /> {store.derived.hazardType === 'AIR_QUALITY_ALERT' ? (t.airborneGasDetected || 'Airborne Gas Detected') : store.derived.hazardType?.replace(/_/g, ' ')}
               </div>
             )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">{t.hazardConfidenceMatrix || 'Hazard Confidence Matrix'}</div>
             
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-semibold text-slate-700">{t.localSensorConfirmation || 'Local Sensor Confirmation'}</span>
                   <span className="text-emerald-600 font-bold">100%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-semibold text-slate-700">{t.externalApiWarning || 'External API Warning (Sim)'}</span>
                   <span className="text-slate-500 font-bold">N/A</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                 </div>
               </div>

               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-semibold text-slate-700">{t.overallConfidence || 'Overall Confidence'}</span>
                   <span className="text-blue-600 font-bold">{store.derived.hazardConfidence}%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${store.derived.hazardConfidence}%` }}></div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Interactive Real Map & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-96 relative flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 z-10">
               <div className="font-bold text-slate-700 flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-blue-500" />
                 {t.regionalTelemetry || 'Regional Environmental Telemetry'}
               </div>
               <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded shadow-sm border border-blue-200">{t.liveDataLink || 'LIVE DATA LINK'}</span>
            </div>
            
            {/* Real Windy Map Integration */}
            <div className="flex-1 relative overflow-hidden">
               {(() => {
                 let overlay = 'wind'; // default
                 if (store.derived.hazardType === 'EXTREME_HEAT' || store.scenario === 'MODE_14_HEATWAVE' || store.scenario === 'MODE_4_HEAT_EXPOSURE' || store.scenario === 'MODE_12_MICROCLIMATE') {
                   overlay = 'temp';
                 } else if (store.derived.hazardType === 'FLOOD_WARNING' || store.scenario === 'MODE_15_FLOOD') {
                   overlay = 'rain';
                 } else if (store.derived.hazardType === 'AIR_QUALITY_ALERT' || store.scenario === 'MODE_7_RESPIRATORY_RISK') {
                   overlay = 'pm2p5';
                 } else if (store.scenario === 'MODE_16_CYCLONE') {
                   overlay = 'wind';
                 }

                 return (
                   <iframe 
                     width="100%" 
                     height="100%" 
                     src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=5&overlay=${overlay}&product=ecmwf&level=surface&lat=17.385&lon=78.486&detailLat=17.385&detailLon=78.486&marker=true`}
                     frameBorder="0"
                     style={{ border: 0, width: '100%', height: '100%' }}
                     title="Environmental Hazard Map"
                   ></iframe>
                 );
               })()}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3">
             <Info className="w-5 h-5 text-blue-600 mt-0.5" />
             <div>
               <h4 className="font-bold text-blue-900">{t.liveIntelligenceCore || 'Live External Intelligence Core'}</h4>
               <p className="text-sm text-blue-800 mt-1">
                 {t.liveIntelligenceDesc || `PRAANA correlates your local environmental edge sensors with LIVE global APIs (Windy/ECMWF) to provide multi-layered environmental verification. The map above dynamically shifts its telemetry layer based on the specific hazard PRAANA detects.`}
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
