import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type GlobalMode = 'SIMULATION' | 'HARDWARE';
// ... (I need to rewrite the create call)
export type RiskState = 'SAFE' | 'CAUTION' | 'HIGH RISK' | 'EMERGENCY';
export type Scenario = 
  | 'MODE_1_NORMAL'
  | 'MODE_2_EXERCISE'
  | 'MODE_3_STATIONARY_HIGH_HR'
  | 'MODE_4_HEAT_EXPOSURE'
  | 'MODE_5_HEAT_EXERTION'
  | 'MODE_6_DEHYDRATION'
  | 'MODE_7_RESPIRATORY_RISK'
  | 'MODE_8_LOW_SPO2'
  | 'MODE_9_FATIGUE'
  | 'MODE_10_FALL'
  | 'MODE_11_FALL_NORMAL_VITALS'
  | 'MODE_12_MICROCLIMATE'
  | 'MODE_13_EXTREME_WEATHER'
  | 'MODE_14_HEATWAVE'
  | 'MODE_15_FLOOD'
  | 'MODE_16_CYCLONE'
  | 'MODE_17_OFFLINE'
  | 'MODE_18_STALE_API'
  | 'MODE_19_SENSOR_FAILURE'
  | 'MODE_20_CASCADE'
  | 'MODE_21_RECOVERY';

export interface SensorData {
  max30102: { hr: number; spo2: number; status: string; confidence: number };
  mlx90614: { bodyTemp: number; ambientTemp: number; status: string; confidence: number };
  bme688: { gasResistance: number; humidity: number; pressure: number; status: string; confidence: number };
  mpu6050: { motion: string; status: string; confidence: number };
  battery: number;
  phoneBattery: number; // added phone battery
  connectivity: 'CONNECTED' | 'LIMITED' | 'DISCONNECTED' | 'LORA_MESH';
}

export interface DetailedRiskScores {
  heat: number;
  respiratory: number;
  cardiovascular: number;
}

export interface WellnessData {
  periodDay: number | null;
  emotionalState: 'CALM' | 'STRESSED' | 'OVERWHELMED' | null;
  gamifiedPoints: number;
}

export interface DerivedData {
  healthReserve: number;
  context: string;
  activity: string;
  recovery: 'FAST' | 'NORMAL' | 'SLOW' | 'VERY SLOW';
  hazard: 'LOW' | 'MEDIUM' | 'HIGH';
  hazardConfidence: number;
  hazardType: string | null;
  disasterPredictionSource: string;
  risk: RiskState;
  detailedRisks: DetailedRiskScores;
  wellness: WellnessData;
  hydration: 'OPTIMAL' | 'MILD_DEHYDRATION' | 'SEVERE_DEHYDRATION';
  fatigue: 'LOW' | 'MODERATE' | 'HIGH';
  sleepQuality: number;
  predictiveHorizon: string;
  exposureDebt: number; // 0-100 cumulative toxic/heat load
  meshNetworkActive: boolean;
  circadianSync: number; // 0-100%
  biologicalAgeOffset: number; // e.g. -2.5 years
  recommendation: string;
  recommendationReason: string;
  edgeAiActive: boolean;
  ultraSaverActive: boolean;
  adaptiveQuestion: string | null;
  healthCapsule: any | null;
}

export interface UserProfile {
  uid?: string;
  email?: string;
  name: string;
  gender: string;
  age: string;
  weight: string;
  height: string;
  healthConditions: string;
  regularMedication: string;
  familyHeartHistory: string;
  fatigueFrequency: string;
  activityLevel: string;
  exerciseFrequency: string;
  sleepHours: string;
  timeOutdoors: string;
  environment: string;
  environmentalRisks: string;
  emergencyContact: string;
  calibrated: boolean;
}

export interface myhealthState {
  globalMode: GlobalMode;
  language: 'EN' | 'TE';
  hardwareStatus: any; // Allow object for hardware connection details
  simulationState: 'PLAYING' | 'PAUSED';
  simulationSpeed: number;
  scenario: Scenario;
  scenarioStartTime: number;
  simTime: number;
  
  userProfile: UserProfile;
  sensors: SensorData;
  derived: DerivedData;

  setLanguage: (lang: 'EN' | 'TE') => void;
  setGlobalMode: (mode: GlobalMode) => void;
  setScenario: (scenario: Scenario) => void;
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  updateState: (partialState: Partial<myhealthState>) => void;
  tick: () => void;
}

const initialSensors: SensorData = {
  max30102: { hr: 72, spo2: 98, status: 'CONNECTED', confidence: 95 },
  mlx90614: { bodyTemp: 36.5, ambientTemp: 24, status: 'CONNECTED', confidence: 98 },
  bme688: { gasResistance: 100, humidity: 45, pressure: 1013, status: 'CONNECTED', confidence: 99 },
  mpu6050: { motion: 'STATIONARY', status: 'CONNECTED', confidence: 96 },
  battery: 85,
  phoneBattery: 78,
  connectivity: 'CONNECTED',
};

const initialUserProfile: UserProfile = {
  name: '',
  gender: '', 
  age: '',
  weight: '',
  height: '',
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
  emergencyContact: '',
  calibrated: false,
};

const initialDerived: DerivedData = {
  healthReserve: 9200, // scaled to 10000
  context: 'RESTING',
  activity: 'Resting',
  recovery: 'NORMAL',
  hazard: 'LOW',
  hazardConfidence: 0,
  hazardType: null,
  disasterPredictionSource: 'Local Onboard + TS Weatherman API',
  risk: 'SAFE',
  detailedRisks: { heat: 10, respiratory: 5, cardiovascular: 15 },
  wellness: {
    periodDay: 14,
    emotionalState: 'CALM',
    gamifiedPoints: 12450
  },
  hydration: 'OPTIMAL',
  fatigue: 'LOW',
  sleepQuality: 85,
  predictiveHorizon: 'Stable for next 12 hours',
  exposureDebt: 12,
  meshNetworkActive: false,
  circadianSync: 94,
  biologicalAgeOffset: -1.2,
  recommendation: 'All systems normal. Have a great day.',
  recommendationReason: 'Physiological and environmental parameters are within personal baseline.',
  edgeAiActive: true,
  ultraSaverActive: false,
  adaptiveQuestion: null,
  healthCapsule: null,
};

export const usemyhealthStore = create<myhealthState>()(
  persist(
    (set) => ({
      globalMode: 'SIMULATION',
      language: 'EN',
      hardwareStatus: { connected: false },
      simulationState: 'PLAYING',
      simulationSpeed: 1,
      scenario: 'MODE_1_NORMAL',
      scenarioStartTime: Date.now(),
      simTime: Date.now(),
      
      userProfile: initialUserProfile,
      sensors: initialSensors,
      derived: initialDerived,

      setLanguage: (lang) => set({ language: lang }),
      setGlobalMode: (mode) => set({ globalMode: mode }),
      setScenario: (scenario) => set({ scenario, simulationState: 'PLAYING', scenarioStartTime: Date.now() }),
      toggleSimulation: () => set((state) => ({ simulationState: state.simulationState === 'PLAYING' ? 'PAUSED' : 'PLAYING' })),
      setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
      updateState: (partial) => set((state) => ({ ...state, ...partial })),
      tick: () => set((state) => ({ simTime: state.simTime + 1000 * state.simulationSpeed }))
    }),
    {
      name: 'praana-health-store', // unique name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        globalMode: state.globalMode,
        language: state.language,
        scenario: state.scenario,
        scenarioStartTime: state.scenarioStartTime,
        simulationSpeed: state.simulationSpeed,
        userProfile: state.userProfile,
        // We do NOT persist sensors or derived data because it's actively computed
      }),
    }
  )
);
