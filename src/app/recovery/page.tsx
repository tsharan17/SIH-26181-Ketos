'use client';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { usePraanaStore } from '@/store/usePraanaStore';
import { Activity, TrendingDown, TrendingUp, Clock } from 'lucide-react';

const generateMockHistory = (currentHr: number) => {
  const data = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    data.push({
      time: new Date(now.getTime() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hr: Math.round(currentHr + (Math.random() * 10 - 5) - (i > 10 ? 20 : 0)), // simulate a recent drop/spike
      baseline: 75
    });
  }
  return data;
};

export default function RecoveryPage() {
  const store = usePraanaStore();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate some history based on current HR
    setData(generateMockHistory(store.sensors.max30102.hr));
    
    // Periodically update the last point to make it feel alive
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        newData[newData.length - 1] = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hr: Math.round(store.sensors.max30102.hr),
          baseline: 75
        };
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [store.sensors.max30102.hr]);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" /> 
          HEALTH & RECOVERY
        </h1>
        <p className="text-slate-500 mt-1">Real-time physiological recovery tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500">RECOVERY STATE</div>
            <div className="text-2xl font-black text-slate-800">{store.derived.recovery}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500">RECOVERY RATE</div>
            <div className="text-2xl font-black text-slate-800">-12 BPM / min</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500">EST. TIME TO BASELINE</div>
            <div className="text-2xl font-black text-slate-800">4 min</div>
          </div>
        </div>
      </div>

      {/* Recovery Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-lg">Heart Rate Recovery Curve</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Current HR</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Personal Baseline (75 BPM)</div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={['dataMin - 10', 'dataMax + 20']} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <ReferenceLine y={75} stroke="#cbd5e1" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="hr" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
