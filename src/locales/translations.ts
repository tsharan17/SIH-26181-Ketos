import { usemyhealthStore } from '@/store/usemyhealthStore';

export const translations = {
  EN: {
    // Navigation
    dashboard: 'Dashboard',
    wearable: 'Wearable',
    recovery: 'Recovery',
    disaster: 'Disaster',
    myHealth: 'PRAANA',
    modelLab: 'Model Lab',
    calendar: 'Calendar',
    simulationMode: 'SIMULATION MODE',
    hardwareMode: 'HARDWARE MODE',
    
    // Connectors
    hardwareModeActive: 'Hardware Mode Active',
    connectToESP32: 'Connect to your ESP32 device',
    bleConnect: 'BLE Connect',
    wifiConnect: 'Wi-Fi Connect',

    // Dashboard
    healthReserve: 'Health Reserve',
    currentStatus: 'Current Status',
    riskLevel: 'Risk Level',
    safe: 'SAFE',
    caution: 'CAUTION',
    highRisk: 'HIGH RISK',
    emergency: 'EMERGENCY',
    vitalSigns: 'Vital Signs',
    heartRate: 'Heart Rate',
    oxygen: 'Oxygen (SpO2)',
    bodyTemp: 'Body Temp',
    stressLevel: 'Stress Level',
    environmentalHazards: 'Environmental Hazards',
    airQuality: 'Air Quality',
    pressure: 'Pressure',
    personalWellness: 'Personal Wellness',
    points: 'pts',
    cycleTracking: 'Cycle tracking',
    ovulationWindow: 'Ovulation window',
    day: 'Day',
    emotionState: 'Emotion state',
    logFeeling: 'Log Feeling',
    updateModel: 'Update AI Model',
    
    // Calibration
    calibrationRequired: 'AI Model Calibration Required',
    calibrationDesc: 'To provide high-tech personalized insights, our local AI needs to establish your physiological baseline.',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    startCalibration: 'Initialize Model',
    
    // Recovery & Lab
    recoveryOptimization: 'AI Recovery Optimization',
    muscleFatigue: 'Muscle Fatigue Analysis',
    sleepArchitecture: 'Sleep Architecture',
    modelLab: 'Advanced AI Model Lab',
    neuralNetwork: 'Neural Network Status',
    weights: 'Model Weights',
    runInference: 'Run Inference',
    
    advancedMonitoring: 'Advanced Physiological AI Monitoring',
    ultraSaverMode: 'ULTRA SAVER MODE',
    capsuleActive: 'CAPSULE ACTIVE',
    blackBox: 'BLACK BOX',
    edgeAiRec: 'Edge AI Recommendation',
    predictiveHorizon: 'Predictive Horizon',
    motion: 'Motion'
  },
  TE: {
    // Navigation
    dashboard: 'డ్యాష్‌బోర్డ్',
    wearable: 'ధరించగలిగే పరికరం',
    recovery: 'కోలుకోవడం',
    disaster: 'విపత్తు',
    lab: 'మోడల్ ల్యాబ్',
    calendar: 'క్యాలెండర్',
    simulationMode: 'సిమ్యులేషన్ మోడ్',
    hardwareMode: 'హార్డ్‌వేర్ మోడ్',
    myHealth: 'ప్రాణ',
    
    // Connectors
    hardwareModeActive: 'హార్డ్‌వేర్ మోడ్ ఆక్టివ్',
    connectToESP32: 'ESP32 కు కనెక్ట్ చేయండి',
    bleConnect: 'BLE కనెక్ట్',
    wifiConnect: 'Wi-Fi కనెక్ట్',

    // Dashboard
    healthReserve: 'ఆరోగ్య నిల్వ',
    currentStatus: 'ప్రస్తుత స్థితి',
    riskLevel: 'ప్రమాద స్థాయి',
    safe: 'సురక్షితం',
    caution: 'జాగ్రత్త',
    highRisk: 'అధిక ప్రమాదం',
    emergency: 'అత్యవసరం',
    vitalSigns: 'ప్రాణాధార సంకేతాలు',
    heartRate: 'గుండె స్పందన రేటు',
    oxygen: 'ఆక్సిజన్ (SpO2)',
    bodyTemp: 'శరీర ఉష్ణోగ్రత',
    stressLevel: 'ఒత్తిడి స్థాయి',
    environmentalHazards: 'పర్యావరణ ప్రమాదాలు',
    airQuality: 'గాలి నాణ్యత',
    pressure: 'పీడనం',
    personalWellness: 'వ్యక్తిగత శ్రేయస్సు',
    points: 'పాయింట్లు',
    cycleTracking: 'రుతుచక్రం ట్రాకింగ్',
    ovulationWindow: 'అండోత్సర్గము విండో',
    day: 'రోజు',
    emotionState: 'భావోద్వేగ స్థితి',
    logFeeling: 'భావనను లాగ్ చేయండి',
    updateModel: 'AI మోడల్‌ను అప్‌డేట్ చేయండి',
    
    // Calibration
    calibrationRequired: 'AI మోడల్ కాలిబ్రేషన్ అవసరం',
    calibrationDesc: 'వ్యక్తిగతీకరించిన అంతర్దృష్టులను అందించడానికి, మా స్థానిక AI మీ శారీరక బేస్‌లైన్‌ను ఏర్పాటు చేయాలి.',
    age: 'వయస్సు',
    gender: 'లింగం',
    male: 'పురుషుడు',
    female: 'స్త్రీ',
    other: 'ఇతర',
    startCalibration: 'మోడల్‌ను ప్రారంభించండి',
    
    // Recovery & Lab
    recoveryOptimization: 'AI రికవరీ ఆప్టిమైజేషన్',
    muscleFatigue: 'కండరాల అలసట విశ్లేషణ',
    sleepArchitecture: 'స్లీప్ ఆర్కిటెక్చర్',
    modelLab: 'అధునాతన AI మోడల్ ల్యాబ్',
    neuralNetwork: 'న్యూరల్ నెట్‌వర్క్ స్థితి',
    weights: 'మోడల్ బరువులు',
    runInference: 'ఇన్ఫరెన్స్ రన్ చేయండి',
    
    advancedMonitoring: 'అధునాతన శారీరక AI పర్యవేక్షణ',
    ultraSaverMode: 'అల్ట్రా సేవర్ మోడ్',
    capsuleActive: 'క్యాప్సూల్ యాక్టివ్',
    blackBox: 'బ్లాక్ బాక్స్',
    edgeAiRec: 'ఎడ్జ్ AI సిఫార్సు',
    predictiveHorizon: 'ప్రిడిక్టివ్ హారిజోన్',
    motion: 'కదలిక'
  }
};

export function useTranslation() {
  const language = usemyhealthStore((state) => state.language);
  return translations[language] || translations.EN;
}
