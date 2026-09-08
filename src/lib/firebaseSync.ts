import { db } from "./firebase";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

export interface LiveVitalsPayload {
  heartRate: number;
  spo2: number;
  temperature: number;
  humidity: number;
  motion: string;
  fallDetected: boolean;
  battery?: number;
}

let lastSyncTime = 0;
const SYNC_INTERVAL_MS = 2000; // sync every 2 seconds to optimize Firestore writes

/**
 * Syncs the current live vitals to Firestore `live_vitals/current`
 * so both the Web Dashboard and Flutter mobile app see real-time data.
 */
export async function syncVitalsToFirestore(data: LiveVitalsPayload) {
  const now = Date.now();
  
  // Always push immediately if a fall is detected, otherwise throttle by SYNC_INTERVAL_MS
  if (!data.fallDetected && now - lastSyncTime < SYNC_INTERVAL_MS) {
    return;
  }
  
  lastSyncTime = now;

  try {
    // 1. Update the single 'current' live document for fast real-time UI listening
    const liveDocRef = doc(db, "live_vitals", "current");
    await setDoc(liveDocRef, {
      ...data,
      updatedAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString(),
    }, { merge: true });

    // 2. If an emergency fall is detected, immediately write an alert document
    if (data.fallDetected) {
      await addDoc(collection(db, "emergency_alerts"), {
        type: "FALL_DETECTED",
        severity: "CRITICAL",
        heartRate: data.heartRate,
        spo2: data.spo2,
        temperature: data.temperature,
        timestamp: serverTimestamp(),
      });
      console.log("🚨 Emergency fall alert recorded in Firestore!");
    }
  } catch (error: any) {
    console.warn("Firestore sync notice:", error?.message || error);
  }
}
