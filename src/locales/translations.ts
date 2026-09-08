import { usemyhealthStore } from '@/store/usemyhealthStore';

export const translations = {
  EN: {
    // Navigation
    dashboard: 'Dashboard',
    wearable: 'Wearable',
    recovery: 'Recovery',
    disaster: 'Disaster',
    myHealth: 'PRAANA',
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
    motion: 'Motion',

    // Disaster
    disasterIntelligence: 'Disaster Intelligence',
    disasterDesc: 'Local sensor fusion correlated with external hazard intelligence',
    currentHazard: 'Current Hazard',
    noActiveHazards: 'NO ACTIVE HAZARDS',
    hazardDetected: 'HAZARD DETECTED',
    airborneGasDetected: 'Airborne Gas Detected',
    hazardConfidenceMatrix: 'Hazard Confidence Matrix',
    localSensorConfirmation: 'Local Sensor Confirmation',
    externalApiWarning: 'External API Warning (Sim)',
    overallConfidence: 'Overall Confidence',
    regionalTelemetry: 'Regional Environmental Telemetry',
    liveDataLink: 'LIVE DATA LINK',
    liveIntelligenceCore: 'Live External Intelligence Core',
    liveIntelligenceDesc: 'PRAANA correlates your local environmental edge sensors with LIVE global APIs (Windy/ECMWF) to provide multi-layered environmental verification. The map above dynamically shifts its telemetry layer (Thermal, Precipitation, Aerosol/PM2.5, Wind Vector) based on the specific hazard PRAANA detects.',
    firebaseSynced: 'Firebase Synced'
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
    firebaseSynced: 'ఫైర్‌బేస్ సమకాలీకరించబడింది',

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
    motion: 'కదలిక',

    // Disaster
    disasterIntelligence: 'విపత్తు ఇంటెలిజెన్స్',
    disasterDesc: 'బాహ్య ప్రమాద ఇంటెలిజెన్స్‌తో సహసంబంధం ఉన్న స్థానిక సెన్సార్ ఫ్యూజన్',
    currentHazard: 'ప్రస్తుత ప్రమాదం',
    noActiveHazards: 'సక్రియ ప్రమాదాలు లేవు',
    hazardDetected: 'ప్రమాదం కనుగొనబడింది',
    airborneGasDetected: 'గాలిలో గ్యాస్ కనుగొనబడింది',
    hazardConfidenceMatrix: 'ప్రమాద విశ్వాస మాత్రిక',
    localSensorConfirmation: 'స్థానిక సెన్సార్ నిర్ధారణ',
    externalApiWarning: 'బాహ్య API హెచ్చరిక (Sim)',
    overallConfidence: 'మొత్తం విశ్వాసం',
    regionalTelemetry: 'ప్రాంతీయ పర్యావరణ టెలిమెట్రీ',
    liveDataLink: 'లైవ్ డేటా లింక్',
    liveIntelligenceCore: 'లైవ్ ఎక్స్‌టర్నల్ ఇంటెలిజెన్స్ కోర్',
    liveIntelligenceDesc: 'బహుళ-స్థాయి పర్యావరణ ధృవీకరణను అందించడానికి PRAANA మీ స్థానిక పర్యావరణ ఎడ్జ్ సెన్సార్‌లను LIVE గ్లోబల్ APIలతో (Windy/ECMWF) పరస్పరం అనుసంధానిస్తుంది. PRAANA గుర్తించే నిర్దిష్ట ప్రమాదం ఆధారంగా పై మ్యాప్ దాని టెలిమెట్రీ పొరను డైనమిక్‌గా మారుస్తుంది.'
  }
};

export function useTranslation() {
  const language = usemyhealthStore((state) => state.language);
  return translations[language] || translations.EN;
}
