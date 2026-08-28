from fastapi import APIRouter, Depends
from app.models.schemas import WateringRequest, WateringResponse
from app.services.watering_service import check_watering
from app.services.auth_service import get_current_user
from app.services.supabase_client import supabase

router = APIRouter(prefix="/watering", tags=["Watering"])


@router.post("/check", response_model=WateringResponse)
async def watering_check(
    data: WateringRequest,
    plant_id: str | None = None,
    user=Depends(get_current_user),
):
    result = check_watering(data)

    if plant_id:
        supabase.table("watering_logs").insert({
            "plant_id": plant_id,
            "user_id": user.id,
            "water_needed": result.water_needed,
            "recommendation": result.recommendation,
            "estimated_water_saved_liters": result.estimated_water_saved_liters,
        }).execute()

    return result