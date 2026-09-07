'use client';
import React, { useState } from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { useTranslation } from '@/locales/translations';
import { BrainCircuit, Activity, CheckCircle, Target, ActivityIcon, Fingerprint } from 'lucide-react';

export function CalibrationModal() {
  const store = usemyhealthStore();
  const t = useTranslation();
  
  const [age, setAge] = useState<string>('28');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [gender, setGender] = useState<'MALE'|'FEMALE'|'OTHER'>('MALE');
  const [activity, setActivity] = useState<'SEDENTARY'|'MODERATE'|'ACTIVE'|'ATHLETE'>('MODERATE');
  
  const [bloodType, setBloodType] = useState<string>('O+');
  const [vo2max, setVo2max] = useState<string>('45');
  const [hrvBaseline, setHrvBaseline] = useState<string>('65');
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // If already calibrated, don't show
  if (store.userProfile.calibrated) return null;

  const handleCalibrate = () => {
    setLoading(true);
    
    // Fake a complex calibration sequence
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 40);

    setTimeout(() => {
      store.updateState({
        userProfile: {
          ...store.userProfile,
          age: parseInt(age) || 28,
          gender,
          weight: parseInt(weight) || 70,
          height: parseInt(height) || 175,
          bloodType,
          vo2max: parseInt(vo2max) || 45,
          hrvBaseline: parseInt(hrvBaseline) || 65,
          activityLevel: activity,
          calibrated: true
        }
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-4xl w-full shadow-2xl relative overflow-hidden my-8">
        {/* Futuristic grid background */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            {loading ? <Activity className="w-10 h-10 animate-pulse" /> : <BrainCircuit className="w-10 h-10" />}
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">AI Model Initialization</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-lg">
            To generate personalized predictive horizons, our neural engine requires your deep physiological baseline. All genomic and metabolic data is processed locally on the edge.
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Fingerprint className="w-3 h-3 text-blue-400"/> Demographics</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    className="w-1/3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <select 
                    value={gender} 
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-2/3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ActivityIcon className="w-3 h-3 text-emerald-400"/> Physical Biometrics</label>
                <div className="flex gap-2">
                  <div className="relative w-1/2">
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Weight"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                    <span className="absolute right-3 top-4 text-xs font-bold text-slate-500">KG</span>
                  </div>
                  <div className="relative w-1/2">
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Height"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                    <span className="absolute right-3 top-4 text-xs font-bold text-slate-500">CM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-3 h-3 text-rose-400"/> Activity Level</label>
                <div className="flex flex-col gap-2">
                  {(['SEDENTARY', 'MODERATE', 'ACTIVE', 'ATHLETE'] as const).map(act => (
                    <button
                      key={act}
                      onClick={() => setActivity(act)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border text-left flex justify-between items-center ${activity === act ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                    >
                      {act}
                      {activity === act && <CheckCircle className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
               <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-3 h-3 text-purple-400"/> Metabolic / Cellular</label>
                <div className="flex gap-2 mb-2">
                  <div className="relative w-1/2">
                    <input 
                      type="text" 
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      placeholder="Type"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-3 py-3 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all uppercase"
                    />
                    <span className="absolute right-3 top-4 text-[10px] font-bold text-slate-500">BLOOD</span>
                  </div>
                  <div className="relative w-1/2">
                    <input 
                      type="number" 
                      value={vo2max}
                      onChange={(e) => setVo2max(e.target.value)}
                      placeholder="VO2"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-3 py-3 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <span className="absolute right-2 top-4 text-[10px] font-bold text-slate-500">VO2 MAX</span>
                  </div>
                </div>
                <div className="relative w-full">
                  <input 
                    type="number" 
                    value={hrvBaseline}
                    onChange={(e) => setHrvBaseline(e.target.value)}
                    placeholder="HRV"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <span className="absolute right-3 top-4 text-[10px] font-bold text-slate-500">HRV BASE (ms)</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCalibrate}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-lg text-white transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? 'bg-slate-800 border border-slate-700 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-500'}`}
          >
            {loading ? (
              <div className="flex flex-col items-center w-full px-8">
                 <div className="flex justify-between w-full text-xs font-bold text-blue-400 mb-2">
                   <span>Adjusting Model Weights...</span>
                   <span>{progress}%</span>
                 </div>
                 <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-700 overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
                 </div>
              </div>
            ) : (
              <>
                <BrainCircuit className="w-5 h-5" />
                Initialize AI Model
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
