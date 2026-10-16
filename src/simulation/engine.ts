'use client';
import { useEffect, useRef } from 'react';
import { usemyhealthStore, Scenario, SensorData, DerivedData } from '@/store/usemyhealthStore';

// Helper function to safely lerp without overshooting at high delta times
const lerp = (start: number, end: number, amt: number) => {
  const safeAmt = Math.min(1, Math.max(0, amt));
  return (1 - safeAmt) * start + safeAmt * end;
};

export function useSimulationEngine() {
  const lastTick = useRef<number>(Date.now());

  useEffect(() => {
    let animationFrameId: number;
    
    const loop = () => {
      const now = Date.now();
      const delta = (now - lastTick.current) / 1000; // seconds
      
      const storeState = usemyhealthStore.getState();

      if (storeState.simulationState === 'PLAYING' && storeState.globalMode === 'SIMULATION') {
        const speed = storeState.simulationSpeed;
        const tickDelta = delta * speed;
        // Use the globally persisted scenarioStartTime to calculate elapsed time!
        const elapsedScenarioTime = (now - storeState.scenarioStartTime) / 1000 * speed; // simulated seconds since scenario started
        
        const newSensors = { ...storeState.sensors };
        const newDerived = { ...storeState.derived };

        // Default Baseline Targets
        let targetHr = 72;
        let targetSpo2 = 98;
        let targetTemp = 25; // ambient
        let targetHumidity = 50;
        let targetGas = 100; // Normal air quality
        let targetMotion = 'STATIONARY';
        let isApiStale = false;
        let isOffline = false;

        // 21 ADVANCED SIMULATION SCENARIOS
        switch (storeState.scenario) {
          case 'MODE_1_NORMAL':
            targetHr = 70 + Math.sin(now / 3000) * 5;
            targetSpo2 = 98;
            targetTemp = 25;
            targetMotion = 'STATIONARY';
            break;
          case 'MODE_2_EXERCISE':
            targetHr = Math.min(150, 70 + elapsedScenarioTime * 2) + Math.sin(now / 1000) * 5;
            targetMotion = 'RUNNING';
            break;
          case 'MODE_3_STATIONARY_HIGH_HR':
            targetHr = Math.min(140, 70 + elapsedScenarioTime * 1.5) + Math.sin(now / 1000) * 5;
            targetMotion = 'STATIONARY';
            break;
          case 'MODE_4_HEAT_EXPOSURE':
            targetTemp = Math.min(41, 25 + elapsedScenarioTime * 0.2);
            targetHumidity = Math.min(80, 50 + elapsedScenarioTime * 0.5);
            targetHr = Math.min(105, 70 + elapsedScenarioTime * 0.5);
            break;
          case 'MODE_5_HEAT_EXERTION':
            targetTemp = Math.min(38, 25 + elapsedScenarioTime * 0.2);
            targetHumidity = 75;
            targetMotion = 'RUNNING';
            targetHr = Math.min(160, 90 + elapsedScenarioTime * 2);
            break;
          case 'MODE_6_DEHYDRATION':
            targetTemp = 35;
            targetHumidity = 60;
            targetMotion = 'WALKING';
            targetHr = Math.min(130, 80 + elapsedScenarioTime * 0.5);
            break;
          case 'MODE_7_RESPIRATORY_RISK':
            targetGas = Math.max(20, 100 - elapsedScenarioTime * 1); // Poor AQI
            targetSpo2 = Math.max(92, 98 - elapsedScenarioTime * 0.1);
            targetMotion = 'WALKING';
            break;
          case 'MODE_8_LOW_SPO2':
            targetSpo2 = Math.max(88, 98 - elapsedScenarioTime * 0.2);
            targetHr = 95;
            break;
          case 'MODE_9_FATIGUE':
            targetMotion = 'RUNNING';
            targetHr = Math.min(160, 120 + elapsedScenarioTime * 0.5);
            // Simulating slow recovery by keeping HR high
            break;
          case 'MODE_10_FALL':
            if (elapsedScenarioTime < 2) {
              targetMotion = 'WALKING';
            } else if (elapsedScenarioTime < 3) {
              targetMotion = 'FREEFALL';
            } else {
              targetMotion = 'FALL_DETECTED';
              targetHr = 130;
            }
            break;
          case 'MODE_11_FALL_NORMAL_VITALS':
            if (elapsedScenarioTime < 2) targetMotion = 'STATIONARY';
            else if (elapsedScenarioTime < 3) targetMotion = 'FREEFALL';
            else targetMotion = 'FALL_DETECTED';
            targetHr = 72; // Vitals normal, but fell
            targetSpo2 = 98;
            break;
          case 'MODE_12_MICROCLIMATE':
            targetTemp = 43; // Local temp high, regional will be simulated as normal
            targetMotion = 'STATIONARY';
            break;
          case 'MODE_13_EXTREME_WEATHER':
          case 'MODE_14_HEATWAVE':
          case 'MODE_15_FLOOD':
          case 'MODE_16_CYCLONE':
            targetTemp = 32;
            targetHumidity = 85;
            targetMotion = 'WALKING';
            targetHr = 110;
            break;
          case 'MODE_17_OFFLINE':
            isOffline = true;
            targetHr = 85;
            targetMotion = 'WALKING';
            break;
          case 'MODE_18_STALE_API':
            isApiStale = true;
            targetHr = 75;
            break;
          case 'MODE_19_SENSOR_FAILURE':
            newSensors.max30102.status = 'DISCONNECTED';
            targetMotion = 'STATIONARY';
            break;
          case 'MODE_20_CASCADE':
            targetTemp = Math.min(40, 25 + elapsedScenarioTime * 0.5);
            targetHumidity = Math.min(85, 50 + elapsedScenarioTime * 1);
            targetMotion = elapsedScenarioTime > 5 ? 'RUNNING' : 'WALKING';
            targetHr = Math.min(170, 80 + elapsedScenarioTime * 2);
            targetSpo2 = Math.max(90, 98 - elapsedScenarioTime * 0.2);
            break;
          case 'MODE_21_RECOVERY':
            targetHr = Math.max(72, 160 - elapsedScenarioTime * 2);
            targetSpo2 = Math.min(98, 90 + elapsedScenarioTime * 0.2);
            targetTemp = Math.max(25, 38 - elapsedScenarioTime * 0.5);
            targetMotion = 'RESTING';
            break;
          default:
            targetHr = 72;
        }

        // Apply temporally correlated smooth transitions (if sensor is online)
        if (newSensors.max30102.status !== 'DISCONNECTED') {
          newSensors.max30102.hr = lerp(newSensors.max30102.hr, targetHr, tickDelta * 0.1);
          newSensors.max30102.spo2 = lerp(newSensors.max30102.spo2, targetSpo2, tickDelta * 0.05);
        }
        newSensors.mlx90614.ambientTemp = lerp(newSensors.mlx90614.ambientTemp, targetTemp, tickDelta * 0.05);
        newSensors.bme688.gasResistance = lerp(newSensors.bme688.gasResistance, targetGas, tickDelta * 0.2);
        newSensors.bme688.humidity = lerp(newSensors.bme688.humidity, targetHumidity, tickDelta * 0.05);
        newSensors.mpu6050.motion = targetMotion;

        // ECG Simulation
        const currentHr = newSensors.max30102.hr;
        const beatIntervalMs = 60000 / currentHr;
        const phase = (now % beatIntervalMs) / beatIntervalMs; // 0 to 1

        let ecgValue = 0;
        let isArrhythmia = false;

        // Simulate Arrhythmia in MODE_3 (Stationary High HR)
        if (storeState.scenario === 'MODE_3_STATIONARY_HIGH_HR') {
            isArrhythmia = true;
            newDerived.arrhythmiaDetected = true;
            // Simulated PVC or irregular beat (add noise or skip beats)
            if (Math.random() > 0.8) {
               ecgValue = (Math.random() - 0.5) * 0.5; // noisy baseline
            } else {
               // Standard beat but warped
               if (phase < 0.1) ecgValue = 0.2 * Math.sin(phase * Math.PI * 10); // P wave
               else if (phase < 0.15) ecgValue = -0.15; // Q
               else if (phase < 0.2) ecgValue = 1.0; // R (peak)
               else if (phase < 0.25) ecgValue = -0.25; // S
               else if (phase > 0.4 && phase < 0.6) ecgValue = 0.3 * Math.sin((phase - 0.4) * Math.PI * 5); // T wave
            }
        } else {
            newDerived.arrhythmiaDetected = false;
            // Normal Sinus Rhythm PQRST simulation
            if (phase < 0.1) ecgValue = 0.2 * Math.sin(phase * Math.PI * 10); // P wave
            else if (phase < 0.15) ecgValue = -0.1; // Q
            else if (phase < 0.2) ecgValue = 1.0; // R (peak)
            else if (phase < 0.25) ecgValue = -0.2; // S
            else if (phase > 0.4 && phase < 0.6) ecgValue = 0.3 * Math.sin((phase - 0.4) * Math.PI * 5); // T wave
        }
        newSensors.ad8232.ecg = ecgValue;

        // Connectivity Simulation
        if (isOffline) {
          newSensors.connectivity = 'DISCONNECTED';
          newDerived.disasterPredictionSource = storeState.language === 'TE' ? 'స్థానిక సెన్సార్లు మాత్రమే (నెట్‌వర్క్ ఆఫ్‌లైన్)' : 'Local Sensors Only (Network Offline)';
        } else if (isApiStale) {
          newSensors.connectivity = 'LIMITED';
          newDerived.disasterPredictionSource = storeState.language === 'TE' ? 'స్థానిక సెన్సార్లు + కాష్ చేసిన వాతావరణ డేటా' : 'Local Sensors + Cached Weather Data';
        } else {
          newSensors.connectivity = 'CONNECTED';
          newDerived.disasterPredictionSource = storeState.language === 'TE' ? 'ప్రత్యక్ష వాతావరణ డేటా + స్థానిక సెన్సార్ క్రాస్ చెక్' : 'Live Weather Data + Local Sensor Crosscheck';
        }

        // ========================================================
        // AI CORRELATED INTELLIGENCE PIPELINE (Contextual Fusion)
        // ========================================================
        
        const isTe = storeState.language === 'TE';
        let targetHealthReserve = 10000;
        let risk: any = 'SAFE';
        let recommendation = isTe ? "మీ ప్రాణాధార సంకేతాలు మరియు పర్యావరణ పరిస్థితులు అద్భుతంగా ఉన్నాయి. మంచి రోజును గడపండి!" : "Your vital signs and environmental conditions look great. Have a wonderful day!";
        let predictiveHorizon = isTe ? "ప్రస్తుత పోకడల ఆధారంగా, మీరు తదుపరి 12 గంటల పాటు సురక్షితంగా ఉన్నారు." : "Based on current trends, you are stable for the next 12 hours.";
        
        // Detailed Risks
        let heatRisk = Math.min(100, Math.max(0, (newSensors.mlx90614.ambientTemp - 28) * 6));
        let respRisk = Math.min(100, Math.max(0, ((100 - newSensors.bme688.gasResistance) / 2) + (95 - newSensors.max30102.spo2) * 10));
        let cvRisk = Math.min(100, Math.max(0, (newSensors.max30102.hr - 90) * 1.5));
        
        // Multi-Risk Evaluation
        if (newSensors.mpu6050.motion === 'FALL_DETECTED') {
           newDerived.context = 'FALL DETECTED';
           risk = 'EMERGENCY';
           targetHealthReserve = 1000;
           recommendation = isTe ? 'కిందపడినట్లు గుర్తించబడింది. మెష్ నెట్‌వర్క్ ద్వారా మీ అత్యవసర పరిచయాలను అప్రమత్తం చేయడానికి సిస్టమ్ సిద్ధమవుతోంది.' : 'A fall was detected. The system is preparing to alert your emergency contacts via the mesh network.';
           predictiveHorizon = isTe ? 'తక్షణ సహాయం అవసరం. సాధారణ పర్యవేక్షణ నిలిపివేయబడింది.' : 'Immediate assistance required. Normal monitoring is suspended.';
        } else if (storeState.scenario === 'MODE_12_MICROCLIMATE') {
           newDerived.context = 'LOCALIZED HEAT TRAP';
           risk = 'CAUTION';
           targetHealthReserve = 7500;
           heatRisk = 85;
           recommendation = isTe ? 'మీరు నిలబడి ఉన్న చోట నగరం మిగతా భాగంతో పోలిస్తే చాలా వేడిగా ఉంది. చల్లని గదిలోకి వెళ్లడం లేదా గాలి ప్రసరణను మెరుగుపరచడం పరిగణించండి.' : 'It is much hotter where you are standing compared to the rest of the city. Consider moving to a cooler room or improving ventilation.';
           predictiveHorizon = isTe ? 'మీరు ఇక్కడే ఉంటే, ఉష్ణ ఒత్తిడి సుమారు 30 నిమిషాల్లో మీ శరీరాన్ని ప్రభావితం చేయడం ప్రారంభిస్తుంది.' : 'If you stay here, heat stress will begin affecting your body in about 30 minutes.';
        } else if (storeState.scenario === 'MODE_4_HEAT_EXPOSURE' || storeState.scenario === 'MODE_5_HEAT_EXERTION') {
           newDerived.context = 'HEAT STRESS RISK';
           risk = newSensors.mlx90614.ambientTemp > 38 ? 'HIGH RISK' : 'CAUTION';
           targetHealthReserve = newSensors.mlx90614.ambientTemp > 38 ? 4000 : 6500;
           recommendation = isTe ? 'మీ శరీరం ఎక్కువ వేడిని గ్రహిస్తోంది. దయచేసి ఏదైనా భారీ పనిని ఆపివేయండి, నీడను కనుగొనండి మరియు వెంటనే నీరు త్రాగండి.' : 'Your body is absorbing too much heat. Please stop any heavy activity, find shade, and drink water immediately.';
           let mins = Math.max(5, 60 - Math.round(elapsedScenarioTime));
           predictiveHorizon = isTe ? `హెచ్చరిక: మీరు చల్లబడకపోతే ${mins} నిమిషాల్లో వేడి అలసట ఎక్కువగా సంభవించవచ్చు.` : `Warning: Heat exhaustion is highly likely within ${mins} minutes if you don't cool down.`;
        } else if (storeState.scenario === 'MODE_6_DEHYDRATION') {
           newDerived.context = 'DEHYDRATION DETECTED';
           risk = 'CAUTION';
           targetHealthReserve = 6000;
           recommendation = isTe ? 'దీర్ఘకాలిక ఉష్ణ ప్రదర్శన కారణంగా రక్తాన్ని పంప్ చేయడానికి మీ గుండె కష్టపడుతోంది. మీరు డీహైడ్రేషన్‌కు గురయ్యే అవకాశం ఉంది—దయచేసి నీరు త్రాగండి.' : 'Your heart is working harder to pump blood due to prolonged heat exposure. You are likely dehydrated—please drink water.';
           predictiveHorizon = isTe ? 'నీరు లేకపోతే, మీ శారీరక పనితీరు పడిపోతుంది మరియు ఉష్ణ ఒత్తిడి వేగంగా తీవ్రమవుతుంది.' : 'Without water, your physical performance will drop and heat strain will worsen rapidly.';
        } else if (storeState.scenario === 'MODE_8_LOW_SPO2' || storeState.scenario === 'MODE_7_RESPIRATORY_RISK') {
           newDerived.context = 'RESPIRATORY STRAIN';
           risk = newSensors.max30102.spo2 < 92 ? 'HIGH RISK' : 'CAUTION';
           targetHealthReserve = newSensors.max30102.spo2 < 92 ? 3500 : 5500;
           recommendation = isTe ? 'మీ రక్తంలో ఆక్సిజన్ స్థాయిలు పడిపోతున్నాయి. శారీరక శ్రమను ఆపివేయండి మరియు వీలైతే స్వచ్ఛమైన గాలి ఉన్న ప్రాంతానికి వెళ్లండి.' : 'Your blood oxygen levels are dropping. Stop any physical exertion and move to an area with fresh air if possible.';
           predictiveHorizon = newSensors.max30102.spo2 < 92 
                ? (isTe ? 'క్లిష్టమైనది: 15 నిమిషాల్లో తీవ్రమైన ఆక్సిజన్ లోపం (హైపోక్సియా) ప్రమాదం.' : 'Critical: Severe lack of oxygen (hypoxia) risk in 15 minutes.') 
                : (isTe ? 'రక్తంలో ఆక్సిజన్ నెమ్మదిగా తగ్గుతోంది. మేము దానిని నిశితంగా పరిశీలిస్తున్నాము.' : 'Blood oxygen is slowly declining. We are closely monitoring it.');
        } else if (storeState.scenario === 'MODE_3_STATIONARY_HIGH_HR') {
           newDerived.context = 'ARRHYTHMIA / CARDIAC EVENT';
           risk = 'EMERGENCY';
           targetHealthReserve = 3000;
           recommendation = isTe ? 'మీ గుండె స్పందన రేటు మరియు ECG అసాధారణంగా ఉన్నాయి (అరిథ్మియా కనుగొనబడింది). దయచేసి కూర్చోండి మరియు తక్షణమే వైద్యుడిని సంప్రదించండి.' : 'Your heart rate and ECG are highly irregular (Arrhythmia detected). Please sit down and contact a health professional immediately.';
           predictiveHorizon = isTe ? 'తక్షణ వైద్య సహాయం సూచించబడింది.' : 'Immediate medical consultation advised.';
        } else if (storeState.scenario === 'MODE_20_CASCADE') {
           newDerived.context = 'COMPOUNDING HEALTH RISKS';
           risk = 'EMERGENCY';
           targetHealthReserve = 2000;
           recommendation = isTe ? 'క్లిష్టమైన హెచ్చరిక: తీవ్రమైన వేడి, అధిక హృదయ స్పందన రేటు మరియు పడిపోతున్న ఆక్సిజన్ అన్నీ ఒకేసారి మిమ్మల్ని తాకుతున్నాయి. వెంటనే ఆశ్రయం మరియు వైద్య సహాయం పొందండి.' : 'CRITICAL ALERT: Extreme heat, high heart rate, and dropping oxygen are hitting you all at once. Seek shelter and medical help immediately.';
           let mins = Math.max(2, 15 - Math.round(elapsedScenarioTime));
           predictiveHorizon = isTe ? `ప్రమాదం: మీ శరీరం సుమారు ${mins} నిమిషాల్లో శారీరకంగా కుప్పకూలవచ్చు.` : `Danger: Your body may physically collapse in approximately ${mins} minutes.`;
        } else if (storeState.scenario === 'MODE_14_HEATWAVE' || storeState.scenario === 'MODE_13_EXTREME_WEATHER') {
           newDerived.context = 'SEVERE WEATHER ADVISORY';
           risk = 'CAUTION';
           targetHealthReserve = 7000;
           recommendation = isTe ? 'మీ ప్రాంతానికి తీవ్రమైన వాతావరణ హెచ్చరిక ఉంది. మీ శరీరం ప్రస్తుతం దానిని బాగానే ఎదుర్కొంటోంది, కానీ దయచేసి జాగ్రత్తగా ఉండండి మరియు బయటికి వెళ్లడం నివారించండి.' : 'There is a severe weather alert for your region. Your body is handling it well right now, but please stay cautious and avoid going outside.';
           predictiveHorizon = isTe ? 'కఠినమైన వాతావరణం మీ శరీరం యొక్క సహజ స్థితిస్థాపకతను నెమ్మదిగా హరిస్తోంది.' : 'The harsh weather is slowly draining your body\'s natural resilience.';
        } else if (storeState.scenario === 'MODE_2_EXERCISE') {
           newDerived.context = 'HEALTHY EXERTION';
           risk = 'SAFE';
           targetHealthReserve = 8500;
           recommendation = isTe ? 'మీరు ప్రస్తుతం వ్యాయామం చేస్తున్నారు! మీ ఫిట్‌నెస్ స్థాయికి మీ హృదయ స్పందన రేటు పెరుగుదల పూర్తిగా సాధారణం మరియు ఆరోగ్యకరం.' : 'You are currently exercising! Your heart rate increase is perfectly normal and healthy for your fitness level.';
           predictiveHorizon = isTe ? 'వర్కౌట్‌కు మీ శరీరం బాగా అలవాటు పడుతోంది. కొనసాగించడం సురక్షితం.' : 'Your body is adapting well to the workout. Safe to continue.';
        }

        // Apply health reserve smoothing
        newDerived.healthReserve = lerp(newDerived.healthReserve, targetHealthReserve, tickDelta * 0.1);
        
        // Hazard and Disaster Logic
        if (storeState.scenario === 'MODE_13_EXTREME_WEATHER' || storeState.scenario === 'MODE_14_HEATWAVE' || storeState.scenario === 'MODE_15_FLOOD' || storeState.scenario === 'MODE_16_CYCLONE' || storeState.scenario === 'MODE_7_RESPIRATORY_RISK' || storeState.scenario === 'MODE_20_CASCADE') {
            newDerived.hazard = 'HIGH';
            newDerived.hazardConfidence = Math.min(100, 50 + elapsedScenarioTime * 2);
            if (storeState.scenario === 'MODE_7_RESPIRATORY_RISK') newDerived.hazardType = 'AIR_QUALITY_ALERT';
            else if (storeState.scenario === 'MODE_15_FLOOD') newDerived.hazardType = 'FLOOD_WARNING';
            else newDerived.hazardType = 'EXTREME_WEATHER';
        } else {
            newDerived.hazard = 'LOW';
            newDerived.hazardConfidence = 0;
            newDerived.hazardType = null;
        }

        // Recovery & Wellness Logic (Fatigue, Hydration, Sleep)
        if (heatRisk > 70 || storeState.scenario === 'MODE_6_DEHYDRATION') {
          newDerived.hydration = 'SEVERE_DEHYDRATION';
          newDerived.fatigue = 'HIGH';
        } else if (heatRisk > 40 || cvRisk > 60 || storeState.scenario === 'MODE_5_HEAT_EXERTION') {
          newDerived.hydration = 'MILD_DEHYDRATION';
          newDerived.fatigue = 'MODERATE';
        } else {
          newDerived.hydration = 'OPTIMAL';
          newDerived.fatigue = 'LOW';
        }

        if (storeState.scenario === 'MODE_9_FATIGUE') {
          newDerived.fatigue = 'HIGH';
        }

        if (newSensors.bme688.gasResistance < 40 || newSensors.mlx90614.ambientTemp > 35) {
          newDerived.exposureDebt = Math.min(100, newDerived.exposureDebt + (tickDelta * 0.15));
        } else {
          newDerived.exposureDebt = Math.max(0, newDerived.exposureDebt - (tickDelta * 0.02));
        }

        if (storeState.scenario === 'MODE_1_NORMAL') {
          newDerived.circadianSync = Math.min(100, newDerived.circadianSync + (tickDelta * 0.05));
          newDerived.sleepQuality = Math.min(100, newDerived.sleepQuality + (tickDelta * 0.05));
        } else if (now % 86400000 > 72000000) {
          newDerived.circadianSync = Math.max(0, newDerived.circadianSync - (tickDelta * 0.01));
        }

        newDerived.biologicalAgeOffset = -1.2 + (newDerived.exposureDebt / 100) * 2;

        // Ultra Saver Mode Logic
        newDerived.ultraSaverActive = (newSensors.battery < 15 && newSensors.phoneBattery < 15) || storeState.scenario === 'MODE_17_OFFLINE' || storeState.scenario === 'MODE_15_FLOOD' || storeState.scenario === 'MODE_16_CYCLONE';
        newDerived.meshNetworkActive = newDerived.ultraSaverActive;

        if (newDerived.ultraSaverActive) {
          newSensors.connectivity = 'LORA_MESH';
          newDerived.healthCapsule = {
            loc: '17.385, 78.486',
            hr: Math.round(newSensors.max30102.hr),
            spo2: Math.round(newSensors.max30102.spo2),
            temp: newSensors.mlx90614.ambientTemp.toFixed(1),
            act: newSensors.mpu6050.motion,
            ts: new Date().toISOString(),
            bat: Math.round(newSensors.battery)
          };
        } else {
          newDerived.healthCapsule = null;
        }

        // Update outputs
        newDerived.risk = risk;
        newDerived.recommendation = recommendation;
        newDerived.predictiveHorizon = predictiveHorizon;
        newDerived.detailedRisks.heat = heatRisk;
        newDerived.detailedRisks.respiratory = respRisk;
        newDerived.detailedRisks.cardiovascular = cvRisk;

        storeState.updateState({
          sensors: newSensors,
          derived: newDerived,
          simTime: storeState.simTime + (delta * 1000 * speed)
        });
      }
      
      lastTick.current = now;
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
}
