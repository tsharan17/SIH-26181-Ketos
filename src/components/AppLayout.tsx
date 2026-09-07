'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, Activity, Wind, Map, ShieldAlert, TestTube, Settings } from 'lucide-react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { useTranslation } from '@/locales/translations';
import { useSimulationEngine } from '@/simulation/engine';
import { ESP32Connector } from './ESP32Connector';

const navItemsList = [
  { key: 'dashboard', href: '/', icon: HeartPulse },
  { key: 'wearable', href: '/wearable', icon: Activity },
  { key: 'recovery', href: '/recovery', icon: HeartPulse },
  { key: 'disaster', href: '/disaster', icon: ShieldAlert },
  { key: 'lab', href: '/lab', icon: TestTube },
  { key: 'calendar', href: '/calendar', icon: Map },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { globalMode, setGlobalMode, hardwareStatus, derived, language } = usemyhealthStore();
  const t = useTranslation();
  
  // Start the simulation engine loop
  useSimulationEngine();

  const isUltra = derived?.ultraSaverActive || false;

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-200 transition-colors duration-1000 ${isUltra ? 'bg-black text-slate-300' : 'bg-[#F7F9FC] text-slate-900'}`}>
      
      {/* Floating Top Navigation (Glassmorphism) */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none">
        <header className={`max-w-5xl mx-auto backdrop-blur-xl border shadow-sm rounded-3xl flex items-center justify-between px-6 py-3 pointer-events-auto transition-all ${isUltra ? 'bg-black/70 border-slate-800' : 'bg-white/70 border-white/50'}`}>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${isUltra ? 'from-white to-slate-400' : 'from-slate-900 to-slate-700'}`}>{t.myHealth}</h1>
            </div>
          </div>

          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-2xl ${isUltra ? 'bg-slate-900/50' : 'bg-slate-100/50'}`}>
            {navItemsList.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.key} 
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? (isUltra ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-blue-700 shadow-sm')
                      : (isUltra ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50')
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {t[item.key as keyof typeof t]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => usemyhealthStore.getState().setLanguage(language === 'EN' ? 'TE' : 'EN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isUltra ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {language === 'EN' ? 'తెలుగు' : 'English'}
            </button>
            <button
              onClick={() => setGlobalMode(globalMode === 'SIMULATION' ? 'HARDWARE' : 'SIMULATION')}
              className={`relative overflow-hidden px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                globalMode === 'SIMULATION' 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {globalMode === 'SIMULATION' ? t.simulationMode : t.hardwareMode}
            </button>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="pt-28 pb-32 px-4 max-w-7xl mx-auto min-h-screen">
        <ESP32Connector />
        {children}
      </main>

    </div>
  );
}
