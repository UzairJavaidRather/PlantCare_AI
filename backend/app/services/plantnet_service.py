import httpx
from fastapi import HTTPException
from app.config import settings

PLANTNET_URL = "https://my-api.plantnet.org/v2/identify/all"


async def identify_plant(image_bytes: bytes, filename: str, content_type: str) -> dict:
    params = {"api-key": settings.plantnet_api_key}
    files = {"images": (filename, image_bytes, content_type)}
    data = {"organs": "leaf"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.post(PLANTNET_URL, params=params, files=files, data=data)
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="PlantNet took too long to respond")
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Could not reach PlantNet")

    if response.status_code == 404:
        raise HTTPException(status_code=422, detail="Could not identify any plant in this image")
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"PlantNet error: {response.text}")

    result = response.json()

    if not result.get("results"):
        raise HTTPException(status_code=422, detail="No plant matches found")

    top_match = result["results"][0]
    species = top_match["species"]

    return {
        "scientific_name": species.get("scientificNameWithoutAuthor", "Unknown"),
        "common_name": (species.get("commonNames") or ["Unknown"])[0],
        "confidence": round(top_match["score"] * 100, 1),
        "remaining_requests": result.get("remainingIdentificationRequests", 0),
    }