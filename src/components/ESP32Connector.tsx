import React, { useState } from 'react';
import { Bluetooth, Wifi, Activity, Cloud } from 'lucide-react';
import { usemyhealthStore } from '@/store/usemyhealthStore';
import { syncVitalsToFirestore } from '@/lib/firebaseSync';

export function ESP32Connector() {
  const { globalMode, updateState, hardwareStatus } = usemyhealthStore();
  const [connecting, setConnecting] = useState(false);
  const [deviceIp, setDeviceIp] = useState('praana.local');
  const [cloudSynced, setCloudSynced] = useState(false);

  if (globalMode !== 'HARDWARE') return null;

  const connectBluetooth = async () => {
    try {
      setConnecting(true);
      // Web Bluetooth API generic connection
      const nav = navigator as any;
      const device = await nav.bluetooth?.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'] // Example generic service
      });
      const server = await device?.gatt?.connect();
      updateState({ hardwareStatus: { connected: true, deviceName: device.name || 'ESP32 BLE', batteryLevel: 100, signalStrength: -50 } });
      alert(`Connected to ${device.name}`);
    } catch (e: any) {
      alert(`Bluetooth connection failed: ${e.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const connectWifi = async () => {
    try {
      setConnecting(true);
      const res = await fetch(`http://${deviceIp}/health`);
      if (res.ok) {
        updateState({ hardwareStatus: { connected: true, deviceName: `ESP32 (${deviceIp})`, batteryLevel: 100, signalStrength: -40 } });
        alert('Connected to ESP32 via Wi-Fi!');
        
        // Start polling real-time data
        setInterval(async () => {
          try {
             const dataRes = await fetch(`http://${deviceIp}/health`);
             if (dataRes.ok) {
                const data = await dataRes.json();
                const currentState = usemyhealthStore.getState();
                currentState.updateState({
                   sensors: {
                     ...currentState.sensors,
                     max30102: { 
                        ...currentState.sensors.max30102, 
                        hr: data.heartRate > 0 ? data.heartRate : currentState.sensors.max30102.hr, 
                        spo2: data.spo2 > 0 ? data.spo2 : currentState.sensors.max30102.spo2 
                     },
                     mlx90614: {
                        ...currentState.sensors.mlx90614,
                        ambientTemp: data.temperature
                     },
                     bme688: {
                        ...currentState.sensors.bme688,
                        humidity: data.humidity
                     },
                     mpu6050: {
                        ...currentState.sensors.mpu6050,
                        motion: data.fallDetected ? "FALL_DETECTED" : (data.motion > 1.2 ? "MOVING" : "STATIONARY")
                     }
                   }
                });

                // Sync live vitals to Firebase Firestore
                syncVitalsToFirestore({
                  heartRate: data.heartRate > 0 ? data.heartRate : currentState.sensors.max30102.hr,
                  spo2: data.spo2 > 0 ? data.spo2 : currentState.sensors.max30102.spo2,
                  temperature: data.temperature,
                  humidity: data.humidity,
                  motion: data.fallDetected ? "FALL_DETECTED" : (data.motion > 1.2 ? "MOVING" : "STATIONARY"),
                  fallDetected: !!data.fallDetected,
                  battery: 100
                });
                setCloudSynced(true);
             }
          } catch(e) { /* ignore polling errors to prevent console spam */ }
        }, 200);
        
      } else {
        alert('Failed to connect to ESP32.');
      }
    } catch (e: any) {
      alert(`Wi-Fi connection failed: Make sure the ESP32 is hosting a server at ${deviceIp} and CORS is enabled.`);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 mb-6 flex flex-col md:flex-row items-center gap-4 justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <Activity className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800">Hardware Mode Active</h3>
            {cloudSynced && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full animate-pulse">
                <Cloud className="w-3 h-3 text-emerald-600" /> Firebase Synced
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">Connect to your ESP32 device</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button 
          onClick={connectBluetooth} 
          disabled={connecting}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
        >
          <Bluetooth className="w-4 h-4" />
          BLE Connect
        </button>
        
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <input 
            type="text" 
            value={deviceIp}
            onChange={(e) => setDeviceIp(e.target.value)}
            className="w-32 px-3 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="ESP32 IP"
          />
          <button 
            onClick={connectWifi}
            disabled={connecting}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <Wifi className="w-4 h-4" />
            Wi-Fi Connect
          </button>
        </div>
      </div>
    </div>
  );
}
