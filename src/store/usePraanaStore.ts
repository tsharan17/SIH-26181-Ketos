import { create } from 'zustand';

export type GlobalMode = 'SIMULATION' | 'HARDWARE';
export type RiskState = 'SAFE' | 'CAUTION' | 'HIGH RISK' | 'EMERGENCY';
export type Scenario = 
  | 'NORMAL_DAY' 
  | 'EXERCISE' 
  | 'SLEEPING'
  | 'HEAT_WAVE' 
  | 'POOR_AIR_QUALITY' 
  | 'FLOOD_WARNING'
  | 'FALL' 
  | 'DISASTER' 
  | 'NETWORK_FAILURE' 
  | 'ULTRA_SAVER'
  | 'EMERGENCY';

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

export interface PraanaState {
  globalMode: GlobalMode;
  hardwareStatus: 'WAITING' | 'CONNECTED';
  simulationState: 'PLAYING' | 'PAUSED';
  simulationSpeed: number;
  scenario: Scenario;
  simTime: number;
  
  sensors: SensorData;
  derived: DerivedData;

  setGlobalMode: (mode: GlobalMode) => void;
  setScenario: (scenario: Scenario) => void;
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  updateState: (partialState: Partial<PraanaState>) => void;
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

const initialDerived: DerivedData = {
  healthReserve: 92,
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

export const usePraanaStore = create<PraanaState>((set) => ({
  globalMode: 'SIMULATION',
  hardwareStatus: 'WAITING',
  simulationState: 'PLAYING',
  simulationSpeed: 1,
  scenario: 'NORMAL_DAY',
  simTime: Date.now(),
  
  sensors: initialSensors,
  derived: initialDerived,

  setGlobalMode: (mode) => set({ globalMode: mode }),
  setScenario: (scenario) => set({ scenario, simulationState: 'PLAYING' }),
  toggleSimulation: () => set((state) => ({ simulationState: state.simulationState === 'PLAYING' ? 'PAUSED' : 'PLAYING' })),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  updateState: (partial) => set((state) => ({ ...state, ...partial })),
  tick: () => set((state) => {
    // We will hook this up to the robust engine
    return { simTime: state.simTime + 1000 * state.simulationSpeed };
  })
}));
