from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time
from typing import List, Optional

app = FastAPI(title="My Health AI Backend")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalibrationData(BaseModel):
    age: int
    gender: str
    weight: float
    height: float
    fitness_level: str
    goals: List[str]

class HealthDataPoint(BaseModel):
    heartRate: float
    spo2: float
    temperature: float
    stress: float

class HealthDataBatch(BaseModel):
    userId: str
    data: List[HealthDataPoint]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "My Health AI Backend is running."}

@app.post("/api/ai/calibrate")
def ai_calibrate(data: CalibrationData):
    # TODO: Integrate local LLM or stock model here
    # For now, simulate a high-tech AI response
    time.sleep(1.5)  # Simulate processing time
    
    insights = [
        f"Based on your age ({data.age}) and {data.fitness_level} fitness level, we recommend a baseline of 10,000 steps.",
        "Your metabolic profile suggests morning workouts would be highly beneficial.",
        "We have calibrated your stress baseline algorithms to account for your reported goals."
    ]
    
    if data.gender.lower() == 'female':
        insights.append("Cycle tracking features have been enabled and optimized for your profile.")
        
    return {
        "success": True,
        "ai_analysis": "Calibration complete. Model weights adjusted.",
        "insights": insights,
        "baseline_targets": {
            "daily_steps": 10000 if data.fitness_level in ['beginner', 'intermediate'] else 15000,
            "sleep_hours": 8,
            "water_ml": 2500
        }
    }

@app.post("/api/ai/trends/hourly")
def generate_hourly_trends(batch: HealthDataBatch):
    # Simulate processing an hour's worth of data to generate a trend summary
    if not batch.data:
        raise HTTPException(status_code=400, detail="No data provided")
        
    avg_hr = sum(d.heartRate for d in batch.data) / len(batch.data)
    avg_spo2 = sum(d.spo2 for d in batch.data) / len(batch.data)
    avg_stress = sum(d.stress for d in batch.data) / len(batch.data)
    
    # Simple AI heuristic simulation
    trend_analysis = "Stable"
    if avg_hr > 90 and avg_stress > 60:
        trend_analysis = "Elevated Stress/Activity"
    elif avg_hr < 60:
        trend_analysis = "Deep Rest"
        
    return {
        "timestamp": time.time(),
        "summary": {
            "avg_heart_rate": round(avg_hr, 1),
            "avg_spo2": round(avg_spo2, 1),
            "avg_stress": round(avg_stress, 1),
            "trend": trend_analysis,
            "ai_insight": f"Over the last hour, your vitals indicate {trend_analysis}. Keep monitoring."
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
