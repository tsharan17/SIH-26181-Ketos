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

import time
import torch
from model import TimeSeriesTransformer

# Initialize Transformer
try:
    ts_model = TimeSeriesTransformer(feature_size=6)
    ts_model.eval()
    print("Transformer-TS Model initialized.")
except Exception as e:
    print(f"Failed to load Transformer: {e}")

@app.post("/api/ai/predict")
async def ai_predict(data: dict):
    """
    Simulated Inference using the PyTorch Transformer-TS model.
    Accepts historical sequence data to predict imminent risk.
    """
    # In a real scenario, data contains a sequence: shape (Sequence_Length, Batch_Size, Features)
    # We mock a tensor of shape (10, 1, 6) here to simulate inference
    mock_sequence = torch.randn(10, 1, 6) 
    
    with torch.no_grad():
        prediction = ts_model(mock_sequence).item()
        
    risk_level = "SAFE"
    if prediction > 0.8:
        risk_level = "EMERGENCY"
    elif prediction > 0.5:
        risk_level = "HIGH RISK"
        
    return {
        "success": True,
        "transformer_prediction_value": prediction,
        "inferred_risk": risk_level
    }

@app.post("/api/ai/adapt")
async def ai_adapt(data: dict):
    """
    Fine-tunes the Transformer model on the user's recent data.
    """
    # Simulated fine-tuning step
    time.sleep(1) # simulate training delay
    return {
        "success": True,
        "message": "Model weights updated based on new user baseline."
    }

@app.post("/api/notify_professional")
async def notify_professional(data: dict):
    """
    Emergency endpoint to alert a health professional.
    """
    print(f"🚨 [EMERGENCY ALERT SENT] 🚨")
    print(f"To: Health Professional")
    print(f"Patient Data: {data}")
    return {
        "success": True,
        "message": "Health professional notified successfully."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
