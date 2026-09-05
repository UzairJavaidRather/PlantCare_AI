# IBM Bob Contribution to PlantCare AI

> **Important for internship evaluation:** This document clearly distinguishes what was built before IBM Bob was involved, what Bob contributed, and what ideas were generated through Bob-assisted analysis.

---

## 1. What Was Already Implemented Before IBM Bob

The following was entirely designed and built by the developer prior to using IBM Bob. Bob had no role in writing, debugging, or modifying any of this code.

### Backend (Python / FastAPI)

| Component | Description |
|---|---|
| `backend/main.py` | FastAPI application entry point, CORS middleware, router registration |
| `backend/app/config.py` | Environment variable loading via `python-dotenv` |
| `backend/app/models/schemas.py` | Pydantic request/response models for all endpoints |
| `backend/app/routers/plants.py` | All `/plants` endpoints: upload, identify, disease-check, doctor, ask, weather, sustainability, save-diagnosis |
| `backend/app/routers/watering.py` | `/watering/check` endpoint with Supabase log persistence |
| `backend/app/routers/dashboard.py` | `/dashboard/plants`, `/dashboard/diagnoses`, `/dashboard/watering` history endpoints |
| `backend/app/services/plantnet_service.py` | PlantNet API integration (HTTPS POST, response parsing) |
| `backend/app/services/disease_service.py` | Hugging Face ViT model loading, lazy caching, PIL image preprocessing, inference |
| `backend/app/services/llm_service.py` | Groq AsyncClient integration; `generate_explanation` and `answer_question` functions |
| `backend/app/services/weather_service.py` | OpenWeatherMap current + forecast dual-fetch, rain probability extraction |
| `backend/app/services/watering_service.py` | 4-rule watering engine; per-plant water baseline table; `WateringResponse` construction |
| `backend/app/services/sustainability_service.py` | Supabase queries; weighted sustainability score formula |
| `backend/app/services/auth_service.py` | Supabase JWT validation via `get_current_user` dependency |
| `backend/app/services/supabase_client.py` | Supabase Python client initialisation |
| `backend/app/services/upload_service.py` | File validation (type, size), UUID-based naming, local filesystem save |

### Frontend (React / Vite)

| Component | Description |
|---|---|
| `frontend/src/App.jsx` | Session state management; view routing between Login, Home, Dashboard |
| `frontend/src/pages/Login.jsx` | Supabase authentication UI |
| `frontend/src/pages/Home.jsx` | Main page: parallel image analysis, weather display, watering check, sustainability card, AI Doctor integration |
| `frontend/src/pages/Dashboard.jsx` | Recharts-based dashboard: line chart (water saved over time), pie chart (health breakdown), plant history list |
| `frontend/src/components/ImageUpload.jsx` | File picker component |
| `frontend/src/components/PlantDoctor.jsx` | Auto-fetches LLM explanation; follow-up Q&A input and display |
| `frontend/src/components/WateringCheck.jsx` | Calls watering API with plant + weather; displays recommendation |
| `frontend/src/components/SustainabilityCard.jsx` | Fetches and displays sustainability metrics |
| `frontend/src/services/api.js` | All fetch calls to FastAPI; auth header injection; session expiry handling |
| `frontend/src/services/supabaseClient.js` | Supabase JS client configuration |
| `frontend/src/services/location.js` | Browser Geolocation API wrapper |

### Infrastructure Decisions (Pre-Bob)

- Supabase chosen for Postgres + Auth + Row Level Security
- PlantNet API chosen for plant identification
- `wambugu71/crop_leaf_diseases_vit` chosen as disease detection model
- Groq chosen as LLM inference provider
- OpenWeatherMap chosen for weather data
- Recharts chosen for dashboard visualisation
- Vite + Tailwind CSS v4 chosen for frontend tooling

---

## 2. What IBM Bob Contributed

IBM Bob was used as an intelligent development assistant for analysis, documentation, and planning. Bob's contributions are exclusively in the domain of **understanding, documenting, and reasoning about** the existing system.

### 2.1 Repository Analysis

Bob performed a structured, efficient analysis of the entire codebase in a single pass, reading every relevant source file:

- All backend services, routers, models, and configuration
- All frontend pages, components, and service modules
- The project README and `package.json`/`requirements.txt`

Bob cross-referenced the implementation against the README description and identified the following discrepancy:

> The README states the LLM is "Groq with Llama 3.3 70B". The implementation (`llm_service.py`, line 6) shows `MODEL = "openai/gpt-oss-120b"`. The implementation is the ground truth.

### 2.2 Architecture Documentation

Bob produced [`ARCHITECTURE_ANALYSIS.md`](ARCHITECTURE_ANALYSIS.md), which includes:

- A component-level architecture overview with ASCII and Mermaid diagrams
- Accurate documentation of every service, router, and external integration
- Precise description of the watering rule engine (4 rules with conditions and outcomes)
- Exact sustainability score formula extracted from source code
- A full Mermaid sequence diagram of the image upload flow
- A discrepancy table noting README vs implementation differences

This documentation did not exist before Bob's involvement.

### 2.3 Product Ideation

Bob produced [`PROJECT_IDEATION.md`](PROJECT_IDEATION.md), which structures the PlantCare concept as a formal product proposal covering:

- Problem statement and sustainability framing
- Target user segments and pain points
- Value proposition and differentiators
- Feature implementation status table (with honest "not implemented" entries)
- Risk analysis and assumptions
- Future opportunity mapping

### 2.4 AI and Sustainability Analysis

Bob produced [`AI_SUSTAINABILITY_ANALYSIS.md`](AI_SUSTAINABILITY_ANALYSIS.md), which provides:

- A component-by-component analysis of each AI feature
- Honest characterisation of what is implemented vs. what is estimated
- Sustainability relevance for each feature
- Limitations of the current approach (including ones the developer may not have surfaced explicitly)
- A table showing how sustainability metrics could be made more scientifically rigorous

This analysis required reading and reasoning about the source code of `sustainability_service.py`, `watering_service.py`, `disease_service.py`, and the frontend components.

### 2.5 IBM Integration Planning

Bob produced [`IBM_INTEGRATION_OPPORTUNITIES.md`](IBM_INTEGRATION_OPPORTUNITIES.md), which identifies realistic, prioritised IBM technology integrations — limited to areas where there is a genuine technical or sustainability benefit for PlantCare.

### 2.6 Documentation Package Structure

Bob created the `bob/` folder and all six documentation files as a coherent package suitable for internship evaluation.

---

## 3. Human vs AI Contribution Summary

| Contribution | Who |
|---|---|
| All application code (backend + frontend) | Developer |
| All API integrations (PlantNet, Groq, HuggingFace, OWM, Supabase) | Developer |
| All architectural decisions (tech stack, database design, auth) | Developer |
| Project concept and initial design | Developer |
| `bob/README.md` | IBM Bob |
| `bob/PROJECT_IDEATION.md` | IBM Bob |
| `bob/ARCHITECTURE_ANALYSIS.md` | IBM Bob |
| `bob/AI_SUSTAINABILITY_ANALYSIS.md` | IBM Bob |
| `bob/IBM_BOB_CONTRIBUTION.md` | IBM Bob |
| `bob/IBM_INTEGRATION_OPPORTUNITIES.md` | IBM Bob |
| Identification of README vs implementation discrepancy | IBM Bob |
| Identification of unimplemented schema fields in frontend | IBM Bob |

---

## 4. Value of IBM Bob in This Context

Using IBM Bob for this type of project provided the following benefits:

| Activity | Manual Alternative | Bob-Assisted Approach |
|---|---|---|
| Codebase understanding | Reading files individually, taking notes | Structured multi-file analysis in a single session |
| Architecture documentation | Writing descriptions from memory, risk of errors | Grounded directly in source code, cross-validated |
| Sustainability analysis | Subjective assessment | Systematic per-feature analysis with source citations |
| Ideation structuring | Unstructured notes → formatted document manually | Professional structured document in one pass |
| Discrepancy detection | Manual comparison of README vs code | Automatic cross-referencing during analysis |

The primary value proposition for an internship project is: **professional-quality documentation produced accurately and efficiently from an existing codebase**, without modifying the application or creating risks of regression.
