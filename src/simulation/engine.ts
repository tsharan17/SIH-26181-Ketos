'use client';
import { useEffect, useRef } from 'react';
import { usemyhealthStore, Scenario, SensorData, DerivedData } from '@/store/usemyhealthStore';

// Helper to smoothly transition a value towards a target
const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

export function useSimulationEngine() {
  const store = usemyhealthStore();
  const lastTick = useRef<number>(Date.now());

  useEffect(() => {
    let animationFrameId: number;
    
    const loop = () => {
      const now = Date.now();
      const delta = (now - lastTick.current) / 1000; // seconds
      
      if (store.simulationState === 'PLAYING' && store.globalMode === 'SIMULATION') {
        const speed = store.simulationSpeed;
        const tickDelta = delta * speed;
        
        const newSensors = { ...store.sensors };
        const newDerived = { ...store.derived };

        // Determine targets based on scenario
        let targetHr = 72;
        let targetSpo2 = 98;
        let targetTemp = 24;
        let targetMotion = 'STATIONARY';
        let targetGas = 100; // Normal air quality resistance

        switch (store.scenario) {
          case 'NORMAL_DAY':
            targetHr = 75 + Math.sin(now / 2000) * 5;
            targetMotion = 'WALKING';
            targetGas = 100;
            break;
          case 'EXERCISE':
            targetHr = 145 + Math.sin(now / 1000) * 10;
            targetTemp = 37.5;
            targetMotion = 'RUNNING';
            break;
          case 'SLEEPING':
            targetHr = 55 + Math.sin(now / 5000) * 3;
            targetMotion = 'RESTING';
            break;
          case 'HEAT_WAVE':
            targetTemp = 42;
            targetHr = 105;
            targetMotion = 'STATIONARY';
            break;
          case 'POOR_AIR_QUALITY':
            targetGas = 25; // Low resistance = high gas
            targetSpo2 = 92; // Slight respiratory distress
            targetHr = 95; 
            break;
          case 'FLOOD_WARNING':
            targetTemp = 22;
            targetMotion = 'WALKING';
            // Simulating high activity/evacuation context
            targetHr = 115;
            break;
          case 'FALL':
            targetMotion = 'FALL_DETECTED';
            targetHr = 135; // Shock
            break;
          case 'DEHYDRATION':
            targetTemp = 37.8;
            targetHr = 110;
            break;
          case 'HEART_PALPITATION':
            targetHr = 160 + Math.sin(now / 200) * 20; // Erratic
            targetSpo2 = 94;
            break;
          case 'HYPOTHERMIA':
            targetTemp = 32.5;
            targetHr = 50;
            targetMotion = 'STATIONARY';
            break;
        }

        // Apply temporally correlated smooth transitions
        newSensors.max30102.hr = lerp(newSensors.max30102.hr, targetHr, tickDelta * 0.1);
        newSensors.max30102.spo2 = lerp(newSensors.max30102.spo2, targetSpo2, tickDelta * 0.05);
        newSensors.mlx90614.ambientTemp = lerp(newSensors.mlx90614.ambientTemp, targetTemp, tickDelta * 0.05);
        newSensors.bme688.gasResistance = lerp(newSensors.bme688.gasResistance, targetGas, tickDelta * 0.2);
        
        // Immediate state changes
        newSensors.mpu6050.motion = targetMotion;

        // Drain battery slowly
        newSensors.battery = Math.max(0, store.sensors.battery - (tickDelta * 0.005));
        newSensors.phoneBattery = Math.max(0, store.sensors.phoneBattery - (tickDelta * 0.002));
        
        if (store.scenario === 'NETWORK_FAILURE' || store.scenario === 'DISASTER' || store.scenario === 'ULTRA_SAVER') {
          newSensors.battery = Math.min(newSensors.battery, 12); // simulate low battery during disaster
          newSensors.phoneBattery = Math.min(newSensors.phoneBattery, 8);
        } else if (newSensors.battery < 30 || newSensors.phoneBattery < 30) {
          // Rapid recharge for simulation purposes so we don't get stuck in Ultra Saver
          newSensors.battery = Math.min(100, newSensors.battery + (tickDelta * 20));
          newSensors.phoneBattery = Math.min(100, newSensors.phoneBattery + (tickDelta * 20));
        }

        // Ultra Saver Mode Logic
        newDerived.ultraSaverActive = (newSensors.battery < 15 && newSensors.phoneBattery < 15) || store.scenario === 'NETWORK_FAILURE' || store.scenario === 'ULTRA_SAVER';

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
          newSensors.connectivity = 'CONNECTED';
          newDerived.healthCapsule = null;
        }

        // Edge AI Correlated Intelligence Pipeline
        // Calculate Specific Risk Scores dynamically
        newDerived.detailedRisks.cardiovascular = Math.min(100, Math.max(0, (newSensors.max30102.hr - 60) * 1.2));
        newDerived.detailedRisks.heat = Math.min(100, Math.max(0, (newSensors.mlx90614.ambientTemp - 25) * 6));
        newDerived.detailedRisks.respiratory = Math.min(100, Math.max(0, ((100 - newSensors.bme688.gasResistance) / 2) + (100 - newSensors.max30102.spo2) * 5));

        // Hydration & Fatigue Heuristics
        if (newDerived.detailedRisks.heat > 70) {
          newDerived.hydration = 'SEVERE_DEHYDRATION';
          newDerived.fatigue = 'HIGH';
        } else if (newDerived.detailedRisks.heat > 40 || newDerived.detailedRisks.cardiovascular > 60) {
          newDerived.hydration = 'MILD_DEHYDRATION';
          newDerived.fatigue = 'MODERATE';
        } else {
          newDerived.hydration = 'OPTIMAL';
          newDerived.fatigue = 'LOW';
        }

        // Cumulative Exposure Debt (Innovative feature)
        if (newSensors.bme688.gasResistance < 40 || newSensors.mlx90614.ambientTemp > 35) {
          newDerived.exposureDebt = Math.min(100, newDerived.exposureDebt + (tickDelta * 0.15));
        } else {
          newDerived.exposureDebt = Math.max(0, newDerived.exposureDebt - (tickDelta * 0.02)); // Slow recovery
        }

        // Circadian Sync
        if (store.scenario === 'SLEEPING') {
          newDerived.circadianSync = Math.min(100, newDerived.circadianSync + (tickDelta * 0.05));
        } else if (now % 86400000 > 72000000) { // Simulating late night activity penalty
          newDerived.circadianSync = Math.max(0, newDerived.circadianSync - (tickDelta * 0.01));
        }

        // Biological Age Offset
        newDerived.biologicalAgeOffset = -1.2 + (newDerived.exposureDebt / 100) * 2; // Exposure ages you dynamically

        // Mesh Network Active state simulation
        newDerived.meshNetworkActive = newDerived.ultraSaverActive;

        // Context Engine & Anomaly Detection with Predictive Horizons
        if (newSensors.mpu6050.motion === 'FALL_DETECTED') {
           newDerived.context = 'POSSIBLE FALL';
           newDerived.risk = 'EMERGENCY';
           newDerived.healthReserve = lerp(newDerived.healthReserve, 3000, tickDelta * 0.5);
           newDerived.recommendation = 'Fall detected. Initiating Emergency Mesh Broadcast.';
           newDerived.hazard = 'HIGH';
           newDerived.hazardType = 'MEDICAL_EMERGENCY';
           newDerived.predictiveHorizon = 'Critical condition. Immediate aid required.';
        } else if (newSensors.bme688.gasResistance < 30) {
           newDerived.context = 'RESPIRATORY HAZARD';
           newDerived.hazard = 'HIGH';
           newDerived.hazardConfidence = 96;
           newDerived.hazardType = 'AIR_QUALITY_ALERT';
           newDerived.risk = 'EMERGENCY';
           newDerived.healthReserve = lerp(newDerived.healthReserve, 4500, tickDelta * 0.2);
           newDerived.recommendation = 'Dangerous air quality. Wear an N95 mask and move to filtered air.';
           newDerived.predictiveHorizon = `Severe respiratory distress in ${Math.max(1, Math.round(15 - newDerived.exposureDebt/10))} mins`;
        } else if (newSensors.mlx90614.ambientTemp > 38 && newSensors.max30102.hr > 90) {
           newDerived.context = 'HEAT WAVE EXPOSURE';
           newDerived.hazard = 'HIGH';
           newDerived.hazardType = 'EXTREME_HEAT';
           newDerived.hazardConfidence = 89;
           newDerived.risk = 'HIGH RISK';
           newDerived.healthReserve = lerp(newDerived.healthReserve, 5500, tickDelta * 0.1);
           newDerived.recommendation = 'Heat stress detected. Seek shade, rest, and rehydrate immediately.';
           newDerived.predictiveHorizon = `Heat exhaustion imminent in ${Math.max(1, Math.round(45 - newDerived.exposureDebt/5))} mins`;
        } else if (store.scenario === 'FLOOD_WARNING') {
           newDerived.context = 'EVACUATION ACTIVE';
           newDerived.hazard = 'HIGH';
           newDerived.hazardType = 'FLOOD_WARNING';
           newDerived.hazardConfidence = 99;
           newDerived.risk = 'CAUTION';
           newDerived.healthReserve = lerp(newDerived.healthReserve, 7000, tickDelta * 0.05);
           newDerived.recommendation = 'Flood warning active in your zone. Follow micro-climate evacuation routes.';
           newDerived.predictiveHorizon = 'Water levels peaking in 2.5 hours';
        } else if (newDerived.ultraSaverActive) {
           newDerived.context = 'ULTRA SAVER MODE';
           newDerived.hazard = 'MEDIUM';
           newDerived.hazardType = 'NETWORK_OUTAGE';
           newDerived.risk = 'CAUTION';
           newDerived.recommendation = 'Low Power. Prioritizing Vitals & LoRa Mesh Emergency Capsule.';
           newDerived.predictiveHorizon = 'Battery will sustain LoRa ping for 72 hours.';
        } else if (store.scenario === 'SLEEPING') {
           newDerived.context = 'SLEEPING';
           newDerived.activity = 'Low';
           newDerived.healthReserve = lerp(newDerived.healthReserve, 9800, tickDelta * 0.1);
           newDerived.sleepQuality = Math.min(100, newDerived.sleepQuality + tickDelta * 0.1);
           newDerived.risk = 'SAFE';
           newDerived.hazard = 'LOW';
           newDerived.hazardType = null;
           newDerived.recommendation = 'Restful sleep detected. Circadian rhythms syncing perfectly.';
           newDerived.predictiveHorizon = 'Full physical recovery expected in 4 hours.';
        } else if (newSensors.max30102.hr > 110 && newSensors.mpu6050.motion === 'RUNNING') {
           newDerived.context = 'EXERCISING';
           newDerived.activity = 'High';
           newDerived.healthReserve = lerp(newDerived.healthReserve, 8500, tickDelta * 0.05);
           newDerived.risk = 'SAFE';
           newDerived.hazard = 'LOW';
           newDerived.hazardType = null;
           newDerived.recommendation = 'Cardio exercise tracking active. Good heart rate response.';
           newDerived.predictiveHorizon = 'Optimal metabolic load. Maintain pace for 20 more mins.';
           if (!newDerived.adaptiveQuestion && Math.random() > 0.95) {
             newDerived.adaptiveQuestion = "You're pushing harder than usual. Are you okay or feeling unusual fatigue?";
           }
        } else {
           newDerived.context = 'NORMAL ACTIVITY';
           newDerived.hazard = 'LOW';
           newDerived.hazardType = null;
           newDerived.healthReserve = lerp(newDerived.healthReserve, 9500, tickDelta * 0.05);
           newDerived.risk = 'SAFE';
           newDerived.recommendation = 'All baseline health parameters are optimal.';
           newDerived.predictiveHorizon = 'Stable trajectory for the next 12 hours.';
           if (newDerived.adaptiveQuestion && Math.random() > 0.95) {
             newDerived.adaptiveQuestion = null;
           }
        }

        store.updateState({
          sensors: newSensors,
          derived: newDerived,
          simTime: store.simTime + (delta * 1000 * speed)
        });
      }
      
      lastTick.current = now;
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [store]);
}
