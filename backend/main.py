from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.routers import plants, watering, dashboard

app = FastAPI(title="PlantCare AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://plant-care-ai-rose.vercel.app",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plants.router)
app.include_router(watering.router)
app.include_router(dashboard.router)

# A simple GET endpoint — no input needed
@app.get("/")
async def root():
    return {"message": "PlantCare AI backend is running"}


# A GET endpoint with a path parameter
@app.get("/plants/{plant_id}")
async def get_plant(plant_id: int):
    return {
        "plant_id": plant_id,
        "name": "Tomato",
        "confidence": 92.5
    }


# Pydantic model defines the exact shape of data this endpoint expects
class WateringRequest(BaseModel):
    plant_type: str
    temperature: float
    humidity: float
    rain_expected: bool


# A POST endpoint — receives data in the request body
@app.post("/watering-check")
async def watering_check(data: WateringRequest):
    if data.rain_expected and data.humidity > 60:
        recommendation = "Skip watering — rain expected and humidity is high"
        water_needed = False
    elif data.temperature > 30 and data.humidity < 40:
        recommendation = "Water now — hot and dry conditions"
        water_needed = True
    else:
        recommendation = "Check soil moisture before deciding"
        water_needed = None

    return {
        "plant_type": data.plant_type,
        "water_needed": water_needed,
        "recommendation": recommendation
    }