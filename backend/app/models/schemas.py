from pydantic import BaseModel
from typing import Optional


class WateringRequest(BaseModel):
    plant_type: str
    temperature: float
    humidity: float
    rain_probability: float          # 0-100, from the weather service
    soil_moisture: float | None = None   # 0-100 if the user has a sensor/manual estimate, else None
    days_since_last_watered: int | None = None


class WateringResponse(BaseModel):
    plant_type: str
    water_needed: bool
    recommendation: str
    estimated_water_saved_liters: float


class PlantResponse(BaseModel):
    plant_id: int
    name: str
    confidence: float
    
class UploadResponse(BaseModel):
    filename: str
    content_type: str
    size_kb: float
    message: str
    
class IdentificationResponse(BaseModel):
    scientific_name: str
    common_name: str
    confidence: float
    remaining_requests: int
    
class DiseaseResponse(BaseModel):
    label: str
    is_healthy: bool
    confidence: float
    
class PlantDoctorRequest(BaseModel):
    plant_name: str
    disease_label: str
    is_healthy: bool
    confidence: float
    temperature: float | None = None
    humidity: float | None = None


class PlantDoctorResponse(BaseModel):
    explanation: str


class AskQuestionRequest(BaseModel):
    plant_name: str
    disease_label: str
    question: str


class AskQuestionResponse(BaseModel):
    answer: str
    
class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    rain_probability: float
    condition: str
    location: str
    
class SustainabilityResponse(BaseModel):
    total_water_saved_liters: float
    plants_monitored: int
    diseases_detected: int
    sustainability_score: float
    
class PlantHistoryItem(BaseModel):
    id: str
    scientific_name: str
    common_name: str | None
    created_at: str


class DiagnosisHistoryItem(BaseModel):
    id: str
    plant_id: str
    disease_label: str | None
    is_healthy: bool
    confidence: float
    created_at: str


class WateringHistoryItem(BaseModel):
    id: str
    plant_id: str
    water_needed: bool
    estimated_water_saved_liters: float
    created_at: str