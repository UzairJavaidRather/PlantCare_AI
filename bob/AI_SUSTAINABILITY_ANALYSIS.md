# PlantCare AI — AI and Sustainability Analysis

> **Produced with IBM Bob assistance** | Grounded in actual source code

---

## Overview

PlantCare combines four distinct AI/ML capabilities with a sustainability objective: helping users care for plants more effectively while using less water and catching diseases early. This document analyses each AI component and its sustainability relevance, based on the actual implementation.

---

## 1. Plant Identification (PlantNet API)

### What It Does

PlantCare sends the uploaded image to the PlantNet `/v2/identify/all` API endpoint with `organs=leaf`. PlantNet returns the top botanical match with `scientific_name`, `common_name`, and a confidence score.

### AI Basis

PlantNet uses deep learning models trained on herbarium specimen data and crowd-sourced plant photos. It is not a model PlantCare maintains or fine-tunes; it is a third-party API.

### Sustainability Relevance

- Knowing the correct species is a prerequisite for species-specific care and watering advice.
- Misidentification would propagate through the rest of the pipeline (wrong watering baseline, irrelevant disease context for the LLM).
- Correct identification enables water-efficient, species-appropriate care rather than generic watering schedules.

### Limitations

- PlantNet's confidence on cropped, low-quality, or unusual images may be low.
- The `remaining_requests` field is returned and available but not surfaced to the user in the current UI.
- Only the top match is used; multi-match uncertainty is not communicated to the user.

---

## 2. Leaf Disease Detection (Hugging Face Vision Transformer)

### What It Does

A Vision Transformer (ViT) model — `wambugu71/crop_leaf_diseases_vit` — classifies the uploaded image and returns a disease label with confidence. The `is_healthy` flag is derived by checking whether `"healthy"` appears in the label string.

### AI Basis

- Framework: Hugging Face `transformers.pipeline("image-classification")`
- Architecture: Vision Transformer (ViT) pretrained for crop leaf disease classification
- Inference: runs locally within the FastAPI process; model is lazy-loaded and cached in memory after the first request

### Sustainability Relevance

- **Early detection** is the primary sustainability benefit. A disease caught at early stages can be treated with targeted intervention (e.g., removing affected leaves, applying neem oil) rather than broad-spectrum pesticide application.
- Fewer pesticide applications reduce chemical load on soil and water systems.
- Preventing plant death reduces the resource cost of growing replacement plants.

### Limitations

- The model is trained on specific crop diseases. Its accuracy on ornamental plants, tropical houseplants, or plants not represented in its training data is unknown and not validated in this repository.
- The `is_healthy` determination is a simple string match on `"healthy"` — not a probabilistic threshold.
- No confidence threshold is applied: even a 30% confidence prediction is displayed.
- Inference speed depends on available hardware; there is no batching or async inference — the FastAPI process blocks during model inference.

---

## 3. AI Plant Doctor — Generative AI Explanation (Groq)

### What It Does

After plant identification and disease detection, the `PlantDoctor` component automatically calls `/plants/doctor`. The backend passes the following context to the LLM:

- Plant common name
- Health status (healthy / diseased)
- Disease label
- Detection confidence
- Current temperature and humidity (if weather is available)

The LLM returns a 3–4 paragraph plain-language explanation with:
- What the condition means
- Likely cause
- 2–3 concrete care steps

Users can also ask follow-up questions via `/plants/ask`, which uses the same LLM with plant name and disease label as context.

### AI Basis

- Client: `groq.AsyncGroq`
- Model in implementation: `openai/gpt-oss-120b` (note: README references Llama 3.3 70B — implementation is the source of truth)
- Temperature: 0.4 (relatively focused responses)
- Max tokens: 400 (concise responses enforced)

### Sustainability Relevance

- **Reduces the knowledge barrier** for appropriate intervention. A user who understands what "early blight" means on a tomato is more likely to act quickly and correctly, reducing plant loss.
- **Weather context in the prompt** means care advice accounts for current conditions (e.g., not recommending irrigation when humidity is high).
- Reduces unnecessary product purchases (pesticides, fertilisers) by giving specific, situation-aware advice.

### Limitations

- The LLM is not fine-tuned on plant care data; it draws on general training knowledge.
- There is no retrieval-augmented generation (RAG) or grounding against a verified plant database.
- The 400-token limit means very detailed care plans may be truncated.
- LLM responses are not validated for factual accuracy; a confident but incorrect recommendation is possible.

---

## 4. Weather-Aware Watering (OpenWeatherMap + Rule Engine)

### What It Does

The app fetches live weather data (temperature, humidity, rain probability for the next forecast period) using the browser's geolocation coordinates. This data feeds a rule-based watering engine in `watering_service.py`.

### Rule Logic (confirmed from source)

| Priority | Condition | Outcome |
|---|---|---|
| 1 | Rain probability ≥ 50% AND humidity ≥ 60% | Skip watering; log water saved |
| 2 | Soil moisture ≥ 50% (if provided) | Skip watering; log water saved |
| 3 | Temperature ≥ 30°C AND humidity ≤ 40% AND soil dry/unknown | Water now |
| 4 | Days since last watering ≥ 5 | Water now |
| Default | No strong signal | Check by touch; partial water credit |

### Sustainability Relevance

Weather-aware watering is the **most direct and measurable sustainability mechanism** in PlantCare:

- Prevents unnecessary watering when rain is expected, reducing water consumption.
- Detects hot, dry conditions where under-watering is harmful — preventing plant stress and eventual loss.
- Water savings are logged per event and aggregated into the sustainability score.

### Limitations

- Rule thresholds (50% rain probability, 60% humidity, 30°C) are reasonable defaults but are not calibrated to specific plant species or climates.
- Soil moisture input is optional (`None` by default in `WateringCheck.jsx` — the component does not collect it from the user). Only the weather inputs are passed from the frontend.
- Days since last watering is also `None` by default in the frontend component — this rule can only trigger if explicitly provided.
- No machine learning is applied; the rules do not adapt to observed outcomes.

---

## 5. Sustainability Scoring

### What It Does

`sustainability_service.py` computes a score out of 100 for the authenticated user by querying three Supabase tables:

```
water_points   = min(100, (total_water_saved_L / 50) × 100)   → weight 50%
plants_points  = min(100, (plants_monitored / 10) × 100)       → weight 30%
disease_points = min(100, diseases_detected × 15)              → weight 20%

sustainability_score = water_points×0.5 + plants_points×0.3 + disease_points×0.2
```

The result is displayed in `SustainabilityCard.jsx` alongside raw figures for water saved, plants monitored, and diseases detected.

### What the Score Actually Measures

The score is a **proxy for app engagement behaviour** correlated with sustainable actions, not a direct measurement of environmental impact. Specifically:

- `total_water_saved_liters` is the sum of `estimated_water_saved_liters` from watering log rows — values that come from the fixed plant-type baseline table (e.g., 0.5L for tomato), not from actual irrigation measurement.
- `plants_monitored` counts distinct plant records in the database.
- `diseases_detected` counts diagnoses where `is_healthy = false`.

The source code explicitly comments: *"These are deliberately simple thresholds, not scientifically derived."*

### Sustainability Relevance

- Makes the sustainability benefit of using the app **visible and tangible** to users.
- Creates a behavioural feedback loop — users who see their score increase are motivated to continue using the app for watering decisions and disease checks.
- Honest framing is important: the score reflects patterns of engagement, not independently verified environmental savings.

### How the Metrics Could Be Improved Scientifically

| Current Approach | More Rigorous Alternative |
|---|---|
| Fixed plant baseline water volumes | Per-species evapotranspiration rates calibrated to local climate data |
| Rule-based "skip/water" binary | IoT soil moisture sensor data for actual soil moisture validation |
| Diseases detected = count of unhealthy diagnoses | Severity grading + treatment outcome tracking to confirm early intervention benefit |
| Score normalised against arbitrary targets | Benchmarked against a verified household water use dataset |
| No carbon accounting | Integration with plant growth data to estimate carbon sequestration offset |

---

## 6. Computer Vision Pipeline Summary

```
User uploads image
       │
       ├──→ PlantNet API (cloud, external)
       │         └─ Returns: species, confidence
       │
       └──→ HuggingFace ViT (local, in-process)
                 └─ Returns: disease label, confidence
```

Both calls are made in parallel from the frontend (`Promise.all`), minimising latency. The disease model runs locally, which keeps inference within the server process but creates a startup latency on first request (model download + load).

---

## 7. Potential Environmental Benefits

The following represent **plausible** benefits based on the implemented features. They are not independently measured or validated in the current implementation:

| Potential Benefit | Mechanism | Confidence |
|---|---|---|
| Reduced water use | Skip-watering recommendations when rain is likely | Directionally plausible |
| Early disease intervention | Reduces spread and chemical treatment | Plausible — depends on user action |
| Reduced plant loss | Better care information prevents neglect | Plausible |
| Reduced pesticide use | Targeted rather than preventive applications | Speculative without outcome data |
| User behaviour change | Sustainability score as a feedback loop | Plausible; not measured |

---

## 8. What Is Implemented vs Estimated vs Future

| Aspect | Status |
|---|---|
| Plant identification | ✅ Implemented and functional |
| Disease label detection | ✅ Implemented and functional |
| LLM plain-language explanation | ✅ Implemented and functional |
| Follow-up Q&A | ✅ Implemented and functional |
| Live weather fetch | ✅ Implemented and functional |
| Rule-based watering advice | ✅ Implemented and functional |
| Water saved (liters) | ⚠️ Estimated — rule-based, not physically measured |
| Sustainability score | ⚠️ Estimated — rule-based proxy, not scientifically calibrated |
| Disease early intervention benefit | ⚠️ Assumed — no outcome tracking |
| Real soil moisture | ❌ Not implemented (field exists in schema, not collected by frontend) |
| Push/email reminders | ❌ Not implemented (noted in README future improvements) |
| Disease model fine-tuning | ❌ Not implemented (noted in README future improvements) |
| Carbon tracking | ❌ Not implemented; future opportunity only |
