'use client';
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Activity, Brain } from 'lucide-react';
import { usemyhealthStore } from '@/store/usemyhealthStore';

export default function CalendarPage() {
  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    // Simulated fetch from our Python Backend / Firestore
    setTrends([
      { date: '2026-09-06', status: 'Stable', insight: 'Good rest, balanced activity.' },
      { date: '2026-09-07', status: 'Elevated Stress', insight: 'High HR during work hours.' }
    ]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Health Calendar & Trends</h1>
          <p className="text-slate-500">Hourly AI analysis of your vitals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Placeholder for actual calendar grid */}
        {[...Array(7)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateStr = date.toISOString().split('T')[0];
          const trend = trends.find(t => t.date === dateStr);

          return (
            <div key={i} className={`p-4 rounded-2xl border ${trend ? 'bg-white border-blue-200' : 'bg-slate-50 border-slate-100'} flex flex-col gap-2 shadow-sm`}>
              <span className="text-xs font-bold text-slate-400">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="text-lg font-black text-slate-800">{date.getDate()}</span>
              {trend && (
                <>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${trend.status.includes('Stress') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {trend.status}
                  </div>
                  <div className="text-xs text-slate-500 mt-auto leading-tight flex items-start gap-1">
                    <Brain className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                    {trend.insight}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg mt-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-start gap-4">
          <Brain className="w-8 h-8 text-indigo-300" />
          <div>
            <h3 className="text-lg font-bold">AI Trend Analysis Active</h3>
            <p className="text-indigo-200 text-sm mt-1">
              Your My Health backend is continuously processing hourly sensor batches to generate these insights. Data is stored securely on your device before syncing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
