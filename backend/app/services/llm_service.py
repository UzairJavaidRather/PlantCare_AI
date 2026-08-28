from groq import AsyncGroq
from fastapi import HTTPException
from app.config import settings

client = AsyncGroq(api_key=settings.groq_api_key)
MODEL = "openai/gpt-oss-120b"


async def _call_groq(system_prompt: str, user_prompt: str) -> str:
    try:
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            model=MODEL,
            temperature=0.4,
            max_tokens=400,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")

    return response.choices[0].message.content


async def generate_explanation(data: dict) -> str:
    system_prompt = (
        "You are a friendly plant care assistant. Explain plant health information "
        "in simple, non-technical language for a home gardener. Be concise — 3-4 short "
        "paragraphs max. Include: what the condition means, likely cause, and 2-3 concrete "
        "care steps. Do not use markdown headers."
    )

    weather_line = ""
    if data.get("temperature") is not None:
        weather_line = f"\nCurrent conditions: {data['temperature']}°C, {data['humidity']}% humidity."

    user_prompt = (
        f"Plant: {data['plant_name']}\n"
        f"Health status: {'Healthy' if data['is_healthy'] else 'Diseased — ' + data['disease_label']}\n"
        f"Detection confidence: {data['confidence']}%"
        f"{weather_line}\n\n"
        "Explain this to the plant owner and give care recommendations."
    )

    return await _call_groq(system_prompt, user_prompt)


async def answer_question(plant_name: str, disease_label: str, question: str) -> str:
    system_prompt = (
        "You are a friendly plant care assistant helping a home gardener. "
        "Keep answers short, practical, and specific to their plant. Do not use markdown headers."
    )
    user_prompt = (
        f"Plant: {plant_name}\n"
        f"Known condition: {disease_label}\n\n"
        f"User's question: {question}"
    )
    return await _call_groq(system_prompt, user_prompt)