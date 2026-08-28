import httpx
from fastapi import HTTPException
from app.config import settings

CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"


async def get_weather(lat: float, lon: float) -> dict:
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.weather_api_key,
        "units": "metric",  # returns Celsius directly, instead of the default Kelvin
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            current_resp = await client.get(CURRENT_URL, params=params)
            forecast_resp = await client.get(FORECAST_URL, params=params)
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Could not reach weather service")

    if current_resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Weather service error (check location or API key)")

    current = current_resp.json()
    forecast = forecast_resp.json()

    # Use the next forecast slot's probability-of-precipitation as our "rain expected" figure
    rain_probability = 0.0
    if forecast_resp.status_code == 200 and forecast.get("list"):
        rain_probability = round(forecast["list"][0].get("pop", 0) * 100, 0)

    city_name = current.get("name") or "Your area"
    country_name = current.get("sys", {}).get("country")
    location = f"{city_name}, {country_name}" if country_name else city_name

    return {
        "temperature": current["main"]["temp"],
        "humidity": current["main"]["humidity"],
        "rain_probability": rain_probability,
        "condition": current["weather"][0]["main"],
        "location": location,
    }