from app.services.supabase_client import supabase

# Reasonable reference points to normalize raw numbers into 0-100 scores.
# These are deliberately simple thresholds, not scientifically derived —
# document this honestly in your project report.
WATER_SAVED_TARGET_LITERS = 50   # "excellent" water-saving over the app's use
PLANTS_MONITORED_TARGET = 10     # "excellent" number of plants actively tracked


def calculate_sustainability(user_id: str) -> dict:
    plants = supabase.table("plants").select("id").eq("user_id", user_id).execute()
    plants_monitored = len(plants.data)

    diagnoses = (
        supabase.table("diagnoses")
        .select("is_healthy")
        .eq("user_id", user_id)
        .execute()
    )
    diseases_detected = sum(1 for d in diagnoses.data if not d["is_healthy"])

    watering_logs = (
        supabase.table("watering_logs")
        .select("estimated_water_saved_liters")
        .eq("user_id", user_id)
        .execute()
    )
    total_water_saved = sum(w["estimated_water_saved_liters"] for w in watering_logs.data)

    # Normalize each raw number to a 0-100 scale, capped at 100
    water_points = min(100, (total_water_saved / WATER_SAVED_TARGET_LITERS) * 100)
    plants_points = min(100, (plants_monitored / PLANTS_MONITORED_TARGET) * 100)
    # Every disease caught early is a genuine win — reward it, but with diminishing
    # weight so this alone can't dominate the score with a handful of diagnoses
    disease_points = min(100, diseases_detected * 15)

    score = round(
        (water_points * 0.5) + (plants_points * 0.3) + (disease_points * 0.2),
        1,
    )

    return {
        "total_water_saved_liters": round(total_water_saved, 2),
        "plants_monitored": plants_monitored,
        "diseases_detected": diseases_detected,
        "sustainability_score": score,
    }