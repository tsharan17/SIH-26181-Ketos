'use client';
import React, { useState, useEffect } from 'react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { BrainCircuit, LogIn, Activity, ChevronRight, CheckCircle } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function CalibrationModal() {
  const store = usemyhealthStore();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  
  // Questionnaire State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    healthConditions: 'None',
    regularMedication: 'No',
    familyHeartHistory: 'Not sure',
    fatigueFrequency: 'Never',
    activityLevel: 'Moderately active',
    exerciseFrequency: '1–2 days',
    sleepHours: '7–9',
    timeOutdoors: '1–3 hours',
    environment: 'Mixed',
    environmentalRisks: 'None',
    emergencyContact: ''
  });

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Check if profile exists
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Profile exists -> user is calibrated, let them into the dashboard
          store.updateState({
            userProfile: { ...docSnap.data() as any, calibrated: true, uid: user.uid, email: user.email! }
          });
          setLoading(false);
          setAuthChecking(false);
        } else {
          // Profile does not exist -> Needs onboarding
          setFormData(prev => ({ ...prev, name: user.displayName || '' }));
          setStep(2); // Move to onboarding
          setLoading(false);
          setAuthChecking(false);
        }
      } else {
        setCurrentUser(null);
        setStep(1); // Show login
        setLoading(false);
        setAuthChecking(false);
      }
    });
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      console.error(e);
      alert('Login failed: ' + e.message);
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const userDoc = doc(db, 'users', currentUser.uid);
      const profile = {
        ...formData,
        email: currentUser.email,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(userDoc, profile);
      
      // Update global store
      store.updateState({
        userProfile: { ...formData, calibrated: true, uid: currentUser.uid, email: currentUser.email! }
      });
    } catch(e) {
      console.error(e);
      alert('Failed to save profile');
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // If already calibrated or auth is still checking, don't show or show loading state
  if (store.userProfile.calibrated && !authChecking) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden my-8">
        
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>

        <div className="relative z-10 flex flex-col items-center">
          
          {loading || authChecking ? (
            <div className="py-20 flex flex-col items-center">
              <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
              <p className="text-blue-400 font-bold tracking-widest uppercase">Initializing Neural Engine...</p>
            </div>
          ) : step === 1 ? (
            // ================== STEP 1: LOGIN ==================
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <BrainCircuit className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Access Praana</h2>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">Authenticate to establish your physiological baseline and sync with the AI Edge network.</p>
              
              <button 
                onClick={handleGoogleLogin}
                className="w-full max-w-md mx-auto py-4 rounded-2xl font-black text-lg text-white transition-all shadow-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] border border-blue-500"
              >
                <LogIn className="w-5 h-5" /> Sign in with Google
              </button>
            </div>
          ) : step === 2 ? (
            // ================== STEP 2: ABOUT YOU ==================
            <div className="w-full">
              <h2 className="text-2xl font-black text-white mb-6">About You</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">What should we call you?</label>
                  <input type="text" placeholder="Name" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
                    <input type="number" placeholder="Years" value={formData.age} onChange={e => handleChange('age', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                    <select value={formData.gender} onChange={e => handleChange('gender', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="" disabled>Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Height (cm)</label>
                    <input type="number" placeholder="Height" value={formData.height} onChange={e => handleChange('height', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Weight (kg)</label>
                    <input type="number" placeholder="Weight" value={formData.weight} onChange={e => handleChange('weight', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              <button onClick={() => setStep(3)} className="mt-8 w-full py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2">
                Continue to Health <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : step === 3 ? (
            // ================== STEP 3: HEALTH ==================
            <div className="w-full">
              <h2 className="text-2xl font-black text-white mb-6">Your Health</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Existing conditions?</label>
                  <select value={formData.healthConditions} onChange={e => handleChange('healthConditions', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="None">None</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="High BP">High BP</option>
                    <option value="Asthma">Asthma</option>
                    <option value="Heart condition">Heart condition</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Taking regular medication?</label>
                  <select value={formData.regularMedication} onChange={e => handleChange('regularMedication', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Family history of heart disease?</label>
                  <select value={formData.familyHeartHistory} onChange={e => handleChange('familyHeartHistory', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Not sure">Not sure</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Frequent fatigue, dizziness, or breathlessness?</label>
                  <select value={formData.fatigueFrequency} onChange={e => handleChange('fatigueFrequency', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Never">Never</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Frequently">Frequently</option>
                  </select>
                </div>
              </div>
              <button onClick={() => setStep(4)} className="mt-8 w-full py-4 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2">
                Continue to Lifestyle <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : step === 4 ? (
            // ================== STEP 4: LIFESTYLE & ENVIRONMENT ==================
            <div className="w-full">
              <h2 className="text-2xl font-black text-white mb-6">Lifestyle & Environment</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Activity Level</label>
                    <select value={formData.activityLevel} onChange={e => handleChange('activityLevel', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Mostly sedentary">Mostly sedentary</option>
                      <option value="Moderately active">Moderately active</option>
                      <option value="Very active">Very active</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Exercise</label>
                    <select value={formData.exerciseFrequency} onChange={e => handleChange('exerciseFrequency', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Rarely">Rarely</option>
                      <option value="1–2 days">1–2 days</option>
                      <option value="3–5 days">3–5 days</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Sleep Hours</label>
                    <select value={formData.sleepHours} onChange={e => handleChange('sleepHours', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="<5">&lt;5</option>
                      <option value="5–6">5–6</option>
                      <option value="6–7">6–7</option>
                      <option value="7–9">7–9</option>
                      <option value="9+">9+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Time Outdoors</label>
                    <select value={formData.timeOutdoors} onChange={e => handleChange('timeOutdoors', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="<1 hour">&lt;1 hour</option>
                      <option value="1–3 hours">1–3 hours</option>
                      <option value="3–6 hours">3–6 hours</option>
                      <option value="6+ hours">6+ hours</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Environment</label>
                    <select value={formData.environment} onChange={e => handleChange('environment', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Local Risks</label>
                    <select value={formData.environmentalRisks} onChange={e => handleChange('environmentalRisks', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="None">None</option>
                      <option value="Extreme heat">Extreme heat</option>
                      <option value="High pollution">High pollution</option>
                      <option value="Flooding">Flooding</option>
                      <option value="Cyclones">Cyclones</option>
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={() => setStep(5)} className="mt-8 w-full py-4 rounded-2xl font-black text-white bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2">
                Final Step <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            // ================== STEP 5: SAFETY ==================
            <div className="w-full text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Emergency Safety</h2>
              <p className="text-sm text-slate-400 mb-6">Who should we contact if your vital signs drop or fall detection triggers?</p>
              
              <div className="text-left">
                <label className="text-xs font-bold text-slate-400 uppercase">Emergency Contact (Name / Rel / Phone)</label>
                <input type="text" placeholder="e.g. John Doe / Brother / +91 9876543210" value={formData.emergencyContact} onChange={e => handleChange('emergencyContact', e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500" />
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={loading}
                className={`mt-8 w-full py-4 rounded-2xl font-black text-lg text-white transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? 'bg-slate-800 text-slate-500' : 'bg-rose-600 hover:bg-rose-500'}`}
              >
                {loading ? 'Saving Profile to Cloud...' : 'Complete Setup & Enter Dashboard'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
