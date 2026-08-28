from fastapi import APIRouter, UploadFile, File, Depends
from app.models.schemas import (
    PlantResponse,
    UploadResponse,
    IdentificationResponse,
    DiseaseResponse,
    PlantDoctorRequest,
    PlantDoctorResponse,
    AskQuestionRequest,
    AskQuestionResponse,
    WeatherResponse,
    SustainabilityResponse,
)
from app.services.upload_service import save_upload
from app.services.plantnet_service import identify_plant
from app.services.disease_service import detect_disease
from app.services.llm_service import generate_explanation, answer_question
from app.services.weather_service import get_weather
from app.services.sustainability_service import calculate_sustainability
from app.services.auth_service import get_current_user
from app.services.supabase_client import supabase

router = APIRouter(prefix="/plants", tags=["Plants"])


# ---------------------------------------------------------------------------
# All literal-path routes go ABOVE the /{plant_id} catch-all at the bottom.
# GET routes especially — a GET /{plant_id} below them would otherwise
# swallow requests meant for these named endpoints.
# ---------------------------------------------------------------------------

@router.get("/weather", response_model=WeatherResponse)
async def weather(lat: float, lon: float):
    result = await get_weather(lat, lon)
    return WeatherResponse(**result)


@router.get("/sustainability", response_model=SustainabilityResponse)
async def sustainability(user=Depends(get_current_user)):
    result = calculate_sustainability(user.id)
    return SustainabilityResponse(**result)


@router.post("/upload", response_model=UploadResponse)
async def upload_plant_image(file: UploadFile = File(...)):
    result = await save_upload(file)
    return UploadResponse(
        filename=result["filename"],
        content_type=result["content_type"],
        size_kb=result["size_kb"],
        message="File uploaded successfully",
    )


@router.post("/identify", response_model=IdentificationResponse)
async def identify(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = await identify_plant(image_bytes, file.filename, file.content_type)
    return IdentificationResponse(**result)


@router.post("/disease-check", response_model=DiseaseResponse)
async def disease_check(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = detect_disease(image_bytes)
    return DiseaseResponse(**result)


@router.post("/doctor", response_model=PlantDoctorResponse)
async def plant_doctor(data: PlantDoctorRequest):
    explanation = await generate_explanation(data.model_dump())
    return PlantDoctorResponse(explanation=explanation)


@router.post("/ask", response_model=AskQuestionResponse)
async def ask_question(data: AskQuestionRequest):
    answer = await answer_question(data.plant_name, data.disease_label, data.question)
    return AskQuestionResponse(answer=answer)


@router.post("/save-diagnosis")
async def save_diagnosis(
    plant_scientific_name: str,
    plant_common_name: str,
    disease_label: str,
    is_healthy: bool,
    confidence: float,
    explanation: str,
    user=Depends(get_current_user),
):
    plant_result = supabase.table("plants").insert({
        "user_id": user.id,
        "scientific_name": plant_scientific_name,
        "common_name": plant_common_name,
    }).execute()

    plant_id = plant_result.data[0]["id"]

    supabase.table("diagnoses").insert({
        "plant_id": plant_id,
        "user_id": user.id,
        "disease_label": disease_label,
        "is_healthy": is_healthy,
        "confidence": confidence,
        "explanation": explanation,
    }).execute()

    return {"message": "Diagnosis saved", "plant_id": plant_id}


# ---------------------------------------------------------------------------
# ALWAYS LAST — the generic catch-all. Anything above this line must stay
# above it; anything new you add later also goes above this line.
# ---------------------------------------------------------------------------

@router.get("/{plant_id}", response_model=PlantResponse)
async def get_plant(plant_id: int):
    return PlantResponse(plant_id=plant_id, name="Tomato", confidence=92.5)