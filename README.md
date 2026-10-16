# PRAANA — AI Health Monitoring System

> **"Not just a wearable. A physiological co-pilot."**
> 
> Built for **Smart India Hackathon (SIH)** by **Team Ketos**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## What is PRAANA?

**PRAANA** (*Prana* — Sanskrit for life force) is a real-time, AI-powered personal health monitoring system that goes far beyond a standard fitness tracker. It is a **Multi-Layered Contextual Inference Engine** that cross-references physiological sensor data with personal health baselines and live environmental intelligence to produce:

- 📊 A **Health Reserve Score** (0–10,000) updated at 60fps
- 🚦 A **4-tier Risk Level** (SAFE → CAUTION → HIGH RISK → EMERGENCY)
- 🤖 **AI-generated Recommendations** in English and Telugu (తెలుగు)
- ⏱️ A **Predictive Horizon** — how long until a critical threshold is reached
- 🆘 An **Emergency Capsule** with LoRa mesh network broadcast on fall detection

---

## Key Features

| Feature | Description |
|---|---|
| 🧠 **Contextual AI Engine** | 5-phase inference pipeline: Baseline → Vitals → Environment → Kinematics → Synthesis |
| 📡 **Dual Hardware Connection** | ESP32 via Wi-Fi HTTP or Web Bluetooth (BLE) |
| 🌡️ **Environmental Intelligence** | Correlates local wearable sensors with Open-Meteo & Windy/ECMWF APIs |
| 💥 **Fall Detection** | Kinematic override using MPU6500 — bypasses all other checks instantly |
| 🗺️ **Live Disaster Map** | Windy map that dynamically switches layers (temp/rain/PM2.5/wind) based on hazard type |
| 🌐 **Bilingual** | Full English + Telugu translation for all UI and AI recommendation strings |
| 🔐 **Google Auth + Firebase** | Secure profile sync, emergency alert logging to Firestore |
| 📴 **Offline + LoRa Mesh** | Ultra Saver Mode with Health Capsule for disaster connectivity |
| 🔁 **21 Simulation Scenarios** | Test every health + environmental + emergency scenario without hardware |
| 👩 **Women's Health** | Menstrual cycle tracking, phase detection, and adjusted AI sensitivity |
| 🎮 **Gamified Wellness** | Points system for healthy behaviors |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  HARDWARE: ESP32-S3 + MAX30102, DHT11, BME688, MPU6500       │
└──────────────────────┬───────────────────────────────────────┘
                       │  BLE / Wi-Fi HTTP
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  EDGE: Next.js App (Client-Side AI Engine @ 60fps)           │
│  Zustand Store ← engine.ts (5-Phase AI Pipeline)            │
└──────────────────────┬───────────────────────────────────────┘
              ┌────────┴────────┐
              ▼                 ▼
     Firebase Cloud      External APIs
  (Auth, Firestore)   (Open-Meteo, Windy)
```

---

## The AI Model — PRAANA Inference Engine

The PRAANA AI is a **5-phase deterministic contextual inference engine** (not a trained ML model — but architected to be swapped with one):

### Phase 1: Baseline Initialization
Calibration data personalizes the AI. Age → `HR_max = 220 - Age`. Pre-existing conditions (e.g., Asthma) shift SpO2 thresholds. Activity level adjusts sensitivity bands.

### Phase 2: Physiological Scoring
Computes three penalty scores every frame:
- **SpO2 Penalty**: Exponential curve below 90% (severe hypoxia)
- **HR Deviation**: High HR + zero motion = cardiac/stress event
- **Environmental Penalty**: DHT11/BME688 readings scored against baseline

### Phase 3: Environmental Cross-Correlation
Compares **local wearable sensor** temperature against **regional API** temperature:
$$\Delta Temp = Temp_{local} - Temp_{regional}$$
If ΔTemp > 15°C → Micro-hazard detected (hot car, fire, industrial zone).

### Phase 4: Kinematic Override (Emergency Layer)
Fall Detection via Sum Vector of Acceleration:
$$A_v = \sqrt{x^2 + y^2 + z^2}$$
**Freefall** → **Impact** → **Motionless** sequence = EMERGENCY override (bypasses all other phases).

### Phase 5: Final Synthesis
$$Reserve = 100 - (P_{SpO2} + P_{HR} + P_{Env}) \times M_{Baseline}$$

| Health Reserve | Risk Level |
|---|---|
| 8,000–10,000 | ✅ SAFE |
| 5,000–7,999 | ⚠️ CAUTION |
| 2,000–4,999 | 🔴 HIGH RISK |
| 0–1,999 or Fall | 🆘 EMERGENCY |

---

## Sensors

| Sensor | Measures | Data |
|---|---|---|
| MAX30102 | Heart Rate + SpO2 (PPG) | `hr` BPM, `spo2` % |
| MLX90614 / DHT11 | Ambient + Body Temp | `ambientTemp` °C |
| BME688 | Gas, Humidity, Pressure | `gasResistance`, `humidity` |
| MPU6050 / 6500 | 6-axis IMU (Fall Detection) | `motion` state |

---

## Simulation Scenarios (21 Modes)

No hardware required! Use the bottom control panel to test:

| Mode | Scenario | Risk |
|---|---|---|
| MODE_1 | Normal resting state | SAFE |
| MODE_2 | Exercise / running | SAFE |
| MODE_3 | High HR while stationary | HIGH RISK |
| MODE_4 | Heat exposure (41°C) | HIGH RISK |
| MODE_5 | Heat + exertion | HIGH RISK |
| MODE_6 | Dehydration | CAUTION |
| MODE_7 | Poor air quality / gas | CAUTION |
| MODE_8 | Low SpO2 (88%) | HIGH RISK |
| MODE_9 | Fatigue (sustained high HR) | HIGH RISK |
| MODE_10 | Fall detection | EMERGENCY |
| MODE_11 | Fall with normal vitals | EMERGENCY |
| MODE_12 | Microclimate heat trap | CAUTION |
| MODE_13 | Extreme weather advisory | CAUTION |
| MODE_14 | Heatwave | CAUTION |
| MODE_15 | Flood + LoRa mesh | CAUTION + Mesh |
| MODE_16 | Cyclone + Ultra Saver | CAUTION + Mesh |
| MODE_17 | Offline (no network) | Local only |
| MODE_18 | Stale API / cached data | LIMITED |
| MODE_19 | Sensor failure (MAX30102) | Degraded |
| MODE_20 | Cascading multi-crisis | EMERGENCY |
| MODE_21 | Recovery / all improving | SAFE ↑ |

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| State | Zustand v5 (with localStorage persistence) |
| Auth + DB | Firebase v12 (Google Auth + Firestore) |
| Charts | Recharts v3 |
| Icons | Lucide React |
| Language | TypeScript v5 |
| Backend (optional) | Python FastAPI |
| Hardware | ESP32-S3 microcontroller |
| APIs | Open-Meteo (weather), Windy/ECMWF (maps) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/Ketos_SIH_aihealth.git

# Navigate to the frontend
cd "My Health"

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Launch

1. Sign in with Google
2. Complete the 5-step AI Calibration (About You → Health → Lifestyle → Environment → Emergency Contact)
3. The dashboard loads automatically with Simulation Mode active
4. Use the bottom bar to switch scenarios or press Hardware Mode to connect your ESP32

### Running the Python Backend (optional)

```bash
cd backend
pip install -r requirements.txt
python main.py
# Runs at http://localhost:8000
```

### Connecting Real Hardware

1. Flash your ESP32 with firmware that exposes a `/health` JSON endpoint
2. Switch to **HARDWARE MODE** in the top nav
3. Enter your ESP32's IP address and click **Wi-Fi Connect** (or use BLE Connect for Bluetooth)

Expected ESP32 JSON response format:
```json
{
  "heartRate": 78.4,
  "spo2": 97.6,
  "temperature": 27.1,
  "humidity": 54.2,
  "motion": 1.05,
  "fallDetected": false
}
```

---

## Project Structure

```
My Health/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Dashboard (main)
│   │   ├── wearable/page.tsx   # Raw sensor stream
│   │   ├── recovery/page.tsx   # AI Recovery protocols
│   │   ├── disaster/page.tsx   # Disaster intelligence + Windy map
│   │   ├── lab/page.tsx        # AI Model Lab
│   │   └── ...
│   ├── components/
│   │   ├── AppLayout.tsx       # Root layout + nav + engine init
│   │   ├── CalibrationModal.tsx # 5-step onboarding wizard
│   │   ├── ESP32Connector.tsx  # Hardware connection panel
│   │   └── SimulationControlPanel.tsx # Scenario selector
│   ├── simulation/
│   │   └── engine.ts           # PRAANA AI Inference Engine (60fps)
│   ├── store/
│   │   └── usemyhealthStore.ts # Zustand global state store
│   ├── lib/
│   │   ├── firebase.ts         # Firebase initialization
│   │   └── firebaseSync.ts     # Throttled Firestore sync
│   └── locales/
│       └── translations.ts     # EN + Telugu translations
├── backend/
│   ├── main.py                 # FastAPI AI backend
│   └── requirements.txt
├── AI_MODEL_SPECIFICATIONS.md  # Detailed AI architecture docs
└── README.md                   # This file
```

---

## Firebase Schema

```
/users/{uid}                  ← User profile (from calibration)
/live_vitals/current          ← Single merged doc for live vitals
/emergency_alerts/{auto-id}   ← New doc per fall event (CRITICAL)
```

---

## Pages Overview

| Page | Path | Purpose |
|---|---|---|
| Dashboard | `/` | Primary health overview, recommendations, emergency capsule |
| Wearable | `/wearable` | Raw sensor data + live weather API |
| Recovery | `/recovery` | AI recovery protocols based on current state |
| Disaster | `/disaster` | Hazard intelligence + live Windy telemetry map |
| AI Lab | `/lab` | Model transparency, inference logs, pipeline status |
| Calendar | `/calendar` | Health calendar (in development) |

---

## Contributing

This is a Smart India Hackathon project. To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

See the [LICENSE](LICENSE) file for details.

---

## Team Ketos — SIH

Built with ❤️ for the people of India.

> *"Healthcare should not be reactive. It should be predictive, contextual, and always with you."*
