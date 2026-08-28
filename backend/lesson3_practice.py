import asyncio


plant_name = "Tomato"              # string (str)
confidence = 92.5                  # float (decimal number)
is_healthy = False                 # boolean (True/False)
disease_count = 1                  # integer (int)

print(plant_name, confidence, is_healthy, disease_count)
print(type(plant_name))            # shows <class 'str'>


def calculate_water_saved(plant_count: int, liters_per_plant: float) -> float:
    """Returns total liters of water saved."""
    return plant_count * liters_per_plant

result = calculate_water_saved(5, 0.5)
print(f"Water saved: {result} liters")


# A dictionary — key/value pairs, just like a JSON object
plant_data = {
    "name": "Tomato",
    "confidence": 92.5,
    "diseases": ["Early Blight", "Late Blight"]   # a list inside a dictionary
}

print(plant_data["name"])          # access by key -> Tomato
print(plant_data["diseases"][0])   # access list item -> Early Blight

# Looping through a dictionary
for key, value in plant_data.items():
    print(f"{key}: {value}")
    
    
    
class Plant:
    def __init__(self, name: str, confidence: float, is_healthy: bool):
        self.name = name
        self.confidence = confidence
        self.is_healthy = is_healthy

    def summary(self) -> str:
        status = "healthy" if self.is_healthy else "diseased"
        return f"{self.name} is {status} ({self.confidence}% confidence)"

my_plant = Plant("Tomato", 92.5, True)
print(my_plant.summary())


def divide(a: float, b: float) -> float:
    try:
        return a / b
    except ZeroDivisionError:
        print("Error: cannot divide by zero")
        return 0.0

print(divide(10, 2))   # 5.0
print(divide(10, 0))   # prints error message, returns 0.0




async def fetch_weather():
    print("Requesting weather data...")
    await asyncio.sleep(2)   # simulates waiting 2 seconds for a network response
    print("Weather data received!")
    return {"temp": 31, "humidity": 40}

async def main():
    result = await fetch_weather()
    print(result)

asyncio.run(main())


from dotenv import load_dotenv
import os

load_dotenv()   # reads the .env file
groq_key = os.getenv("GROQ_API_KEY")
print("Key loaded:", groq_key is not None)