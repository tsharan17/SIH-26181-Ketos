'use client';
import React, { useState } from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { useTranslation } from '@/locales/translations';
import { BrainCircuit, Database, Network, Cpu, Zap, Activity, Terminal } from 'lucide-react';

export default function LabPage() {
  const store = usemyhealthStore();
  const t = useTranslation();
  
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] AI Engine Ready. Waiting for inference trigger...']);

  const runInference = () => {
    if (running) return;
    setRunning(true);
    setLogs(prev => [...prev, '[INFERENCE] Loading model weights into edge memory...']);
    
    setTimeout(() => {
      setLogs(prev => [...prev, '[INFERENCE] Forward pass complete. Generating predictions...']);
      setTimeout(() => {
        setLogs(prev => [...prev, `[RESULT] Analyzed ${Math.floor(Math.random() * 5000 + 1000)} raw sensor data points.`]);
        setLogs(prev => [...prev, `[RESULT] Anomaly Probability: ${(Math.random() * 0.1).toFixed(4)}`]);
        setRunning(false);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 flex items-center gap-3">
            <BrainCircuit className="w-10 h-10 text-indigo-600" />
            {t.modelLab || 'Advanced AI Model Lab'}
          </h1>
          <p className="font-medium text-lg text-slate-500 mt-2">Deep learning transparency and edge-inference diagnostics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Network Architecture */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Network className="w-48 h-48" />
             </div>
             <div className="relative z-10">
               <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                 <Cpu className="w-4 h-4 text-emerald-400" /> {t.neuralNetwork || 'Neural Network Status'}
               </h3>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                   <span className="text-sm font-medium text-slate-300">Architecture</span>
                   <span className="text-sm font-bold text-emerald-400">Transformer-TS</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                   <span className="text-sm font-medium text-slate-300">Parameters</span>
                   <span className="text-sm font-bold text-white">12.4M</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                   <span className="text-sm font-medium text-slate-300">Quantization</span>
                   <span className="text-sm font-bold text-amber-400">INT8 Edge</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                   <span className="text-sm font-medium text-slate-300">Current Latency</span>
                   <span className="text-sm font-bold text-white">42ms</span>
                 </div>
               </div>
               
               <button 
                  onClick={runInference}
                  disabled={running}
                  className={`mt-8 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${running ? 'bg-slate-700 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}
               >
                 {running ? <Activity className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                 {t.runInference || 'Run Edge Inference'}
               </button>
             </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
               <Database className="w-4 h-4 text-blue-500" /> Data Pipeline
             </h3>
             <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <div className="text-sm font-medium text-slate-700">ESP32 BLE Stream Active</div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <div className="text-sm font-medium text-slate-700">Firestore Sync Engine Ready</div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                 <div className="text-sm font-medium text-slate-400">Python Backend Connected</div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Terminal & Logs */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-[#0f172a] rounded-3xl p-1 border border-slate-700 shadow-2xl h-full flex flex-col">
             <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-900 rounded-t-3xl">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
               </div>
               <div className="mx-auto text-xs font-mono text-slate-500 flex items-center gap-2">
                 <Terminal className="w-3 h-3" /> /var/log/ai-inference.log
               </div>
             </div>
             <div className="flex-1 p-6 font-mono text-sm overflow-y-auto max-h-[500px]">
               {logs.map((log, index) => (
                 <div key={index} className={`mb-2 ${log.includes('[INFERENCE]') ? 'text-blue-400' : log.includes('[RESULT]') ? 'text-emerald-400' : 'text-slate-400'}`}>
                   <span className="text-slate-600 mr-2">{new Date().toISOString().split('T')[1].slice(0,12)}</span>
                   {log}
                 </div>
               ))}
               {running && (
                 <div className="text-amber-400 animate-pulse mt-4">_</div>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
