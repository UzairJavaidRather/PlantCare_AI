from fastapi import APIRouter, Depends
from app.services.auth_service import get_current_user
from app.services.supabase_client import supabase
from app.models.schemas import PlantHistoryItem, DiagnosisHistoryItem, WateringHistoryItem

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/plants", response_model=list[PlantHistoryItem])
async def plant_history(user=Depends(get_current_user)):
    result = (
        supabase.table("plants")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/diagnoses", response_model=list[DiagnosisHistoryItem])
async def diagnosis_history(user=Depends(get_current_user)):
    result = (
        supabase.table("diagnoses")
        .select("id, plant_id, disease_label, is_healthy, confidence, created_at")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    return result.data


@router.get("/watering", response_model=list[WateringHistoryItem])
async def watering_history(user=Depends(get_current_user)):
    result = (
        supabase.table("watering_logs")
        .select("id, plant_id, water_needed, estimated_water_saved_liters, created_at")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    return result.data