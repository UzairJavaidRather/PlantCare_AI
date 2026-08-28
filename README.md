# PlantCare AI — Sustainable AI Plant Health Assistant

An AI-powered web app that identifies plants, detects leaf diseases, and gives
resource-efficient care recommendations using computer vision, generative AI,
and live weather data. Built as a learning project covering full-stack
development, applied AI/ML, and sustainability-focused product thinking.

Inspired by the "PlantSathi AI" concept, extended with disease detection,
weather-aware smart watering, and sustainability tracking.

## Features

- **Plant identification** via the PlantNet API
- **Disease detection** using a pretrained Hugging Face vision model
- **AI Plant Doctor** — an LLM (via Groq) explains results in plain language
  and answers follow-up questions
- **Weather-aware smart watering** — rule-based recommendations using live
  temperature, humidity, and rain probability
- **Sustainability tracking** — estimated water saved, plants monitored,
  diseases caught early, combined into a sustainability score
- **User accounts and history** via Supabase (auth + Postgres)
- **Dashboard** with charts (Recharts) showing plant and watering history

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Tailwind CSS v4, Recharts |
| Backend | Python, FastAPI |
| Computer Vision | PyTorch, Hugging Face Transformers |
| Plant ID | PlantNet API |
| Generative AI | Groq (Llama 3.3 70B) |
| Weather | OpenWeatherMap API |
| Database & Auth | Supabase (Postgres + Row Level Security) |
<!-- | Deployment | Vercel (frontend), Render (backend) | -->


## Getting Started Locally

### Prerequisites
- Python 3.12, Node.js 24 LTS, Git
- Accounts/API keys: PlantNet, OpenWeatherMap, Groq, Supabase

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
Run the SQL in `docs/schema.sql` in your Supabase project's SQL Editor
(creates tables and Row Level Security policies).

## Future Improvements

- Fine-tune a disease detection model on a broader, project-specific dataset
- Add push/email notifications for watering reminders
