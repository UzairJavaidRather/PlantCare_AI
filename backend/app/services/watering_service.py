from app.models.schemas import WateringRequest, WateringResponse

PLANT_WATER_BASELINE = {
    "tomato": 0.5,
    "basil": 0.2,
    "rose": 0.4,
    "succulent": 0.05,
    "fern": 0.3,
}
DEFAULT_BASELINE = 0.3


def _get_baseline(plant_type: str) -> float:
    return PLANT_WATER_BASELINE.get(plant_type.lower(), DEFAULT_BASELINE)


def check_watering(data: WateringRequest) -> WateringResponse:
    baseline = _get_baseline(data.plant_type)

    # Rule 1: rain likely + humidity already high -> skip, water saved
    if data.rain_probability >= 50 and data.humidity >= 60:
        return WateringResponse(
            plant_type=data.plant_type,
            water_needed=False,
            recommendation=(
                f"Skip watering — {data.rain_probability:.0f}% chance of rain and humidity "
                f"is already {data.humidity:.0f}%. Nature has this covered."
            ),
            estimated_water_saved_liters=baseline,
        )

    # Rule 2: known soil moisture is already adequate -> skip, water saved
    if data.soil_moisture is not None and data.soil_moisture >= 50:
        return WateringResponse(
            plant_type=data.plant_type,
            water_needed=False,
            recommendation=f"Skip watering — soil moisture is {data.soil_moisture:.0f}%, still adequate.",
            estimated_water_saved_liters=baseline,
        )

    # Rule 3: hot and dry, and soil is dry or unknown -> water now
    soil_is_dry_or_unknown = data.soil_moisture is None or data.soil_moisture < 30
    if data.temperature >= 30 and data.humidity <= 40 and soil_is_dry_or_unknown:
        return WateringResponse(
            plant_type=data.plant_type,
            water_needed=True,
            recommendation=(
                f"Water now — hot ({data.temperature:.0f}°C) and dry "
                f"({data.humidity:.0f}% humidity) conditions with low soil moisture."
            ),
            estimated_water_saved_liters=0.0,
        )

    # Rule 4: it's been a while since watering -> water, regardless of other conditions
    if data.days_since_last_watered is not None and data.days_since_last_watered >= 5:
        return WateringResponse(
            plant_type=data.plant_type,
            water_needed=True,
            recommendation=f"Water now — it's been {data.days_since_last_watered} days since last watering.",
            estimated_water_saved_liters=0.0,
        )

    # Default: no strong signal either way
    return WateringResponse(
        plant_type=data.plant_type,
        water_needed=False,
        recommendation="Conditions look moderate. Check soil by touch — water only if the top inch feels dry.",
        estimated_water_saved_liters=baseline * 0.5,  # partial credit — not a confident "definitely skip"
    )