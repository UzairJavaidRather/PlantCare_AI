from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    plantnet_api_key: str = os.getenv("PLANTNET_API_KEY", "")
    weather_api_key: str = os.getenv("WEATHER_API_KEY", "")
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_service_key: str = os.getenv("SUPABASE_SERVICE_KEY", "")


settings = Settings()