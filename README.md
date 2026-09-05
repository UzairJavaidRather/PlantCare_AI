# PlantCare AI

PlantCare AI is an AI-powered plant health assistant that helps users identify plants, detect disease symptoms from leaf images, get expert explanations from a language model, and make smarter watering decisions using weather conditions. The project combines a FastAPI backend, a React frontend, and Supabase for authentication and user history.

## Overview

This app is designed for everyday plant care and sustainability:

- Identify plants using the PlantNet API
- Detect plant disease from uploaded leaf images
- Explain findings in plain language with Groq-powered LLM assistance
- Answer follow-up questions about diagnoses and plant care
- Recommend whether to water based on temperature, humidity, and rain probability
- Track plant activity, diagnoses, and watering history in a dashboard
- Measure sustainability impact based on water saved and plant monitoring

## Features

- Plant recognition and confidence scoring
- Leaf disease detection using image analysis
- AI Plant Doctor for natural-language explanations
- Smart watering recommendations with weather-aware logic
- Supabase-powered authentication and session management
- Dashboard with charts for health trends and water savings
- User-specific plant and diagnosis history

## Tech Stack

- Frontend: React, Vite, JavaScript, Recharts, Lucide icons
- Backend: Python, FastAPI
- AI/ML: Hugging Face, PyTorch, Groq, PlantNet
- Weather: OpenWeatherMap API
- Database/Auth: Supabase
- Styling: Tailwind CSS v4

## IBM BOB Role

- Role: Technical Documentation and Architecture Analyst
- Contribution: IBM Bob was used to analyse the existing PlantCare AI repository, document the system architecture, assess the AI and sustainability components, and propose future IBM integration opportunities. This contribution was analytical and documentation-focused rather than direct application code development.

## Project Structure

```text
Plantcare-ai/
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   ├── main.py
│   ├── requirements.txt
│   └── uploads/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── README.md
├── package.json
└── bob/
    └── project documentation and ideation notes
```

## Environment Variables

### Backend
Create a `.env` file inside the `backend` folder with the required values:

```env
GROQ_API_KEY=your_groq_key
PLANTNET_API_KEY=your_plantnet_key
WEATHER_API_KEY=your_openweather_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### Frontend
Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Development

### 1. Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will run at:

- http://localhost:8000

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend typically runs at:

- http://localhost:5173

## API Highlights

The backend exposes routes for plant upload, diagnosis, weather, dashboard history, and watering checks. Key endpoints include:

- `POST /plants/upload`
- `POST /plants/identify`
- `POST /plants/disease-check`
- `POST /plants/doctor`
- `POST /plants/ask`
- `GET /plants/weather`
- `GET /plants/sustainability`
- `POST /watering/check`
- `GET /dashboard/plants`
- `GET /dashboard/diagnoses`
- `GET /dashboard/watering`

## Supabase Notes

This app uses Supabase for:

- User authentication
- Session retrieval in the frontend
- Storage of plant history, diagnoses, and watering logs

You should configure your Supabase project and ensure the relevant tables exist for:

- `plants`
- `diagnoses`
- `watering_logs`

## How the App Works

1. A user logs in with Supabase auth.
2. They upload an image of a plant or leaf.
3. The backend identifies the plant and checks for disease.
4. A Groq-based assistant explains the diagnosis in understandable language.
5. Weather data helps determine whether watering is needed.
6. Insights are saved to Supabase and shown in the dashboard.

## Notes

- The project is structured as a learning full-stack AI application and is intended to be extended further.
- Some advanced features depend on valid API keys and a configured Supabase project.
- The frontend and backend are designed to run together locally for development.
- In the deployed version, disease detection may occasionally exceed Render's 512 MB free-tier memory limit while loading the PyTorch/Hugging Face model, causing intermittent failures. The application runs correctly in local development, but reliable production operation requires a paid Render tier with additional memory.

## Future Improvements

- Add stronger disease model tuning for project-specific plant datasets
- Add notifications and reminders for watering schedules
- Improve analytics and sustainability scoring
- Extend plant profile management and historical tracking
- Add deployment configuration for production hosting
