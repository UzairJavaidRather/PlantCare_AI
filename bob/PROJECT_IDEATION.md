# PlantCare AI — Product Ideation Document

> **Produced with IBM Bob assistance** | Based on the implemented PlantCare repository

---

## 1. Problem Statement

Most people who keep plants at home, on balconies, or in small gardens lack the specialist knowledge to identify what they are growing, recognise early signs of disease, or know when and how much to water. The gap between novice plant owners and the expertise required for healthy, resource-efficient plant care leads to preventable plant loss, unnecessary water waste, and over-reliance on pesticides for diseases that could have been caught early.

---

## 2. The Sustainability Problem

Water is a constrained global resource. Household and garden irrigation accounts for a significant share of residential water use. Common watering patterns are either:

- **Over-watering** — driven by anxiety or routine rather than actual plant need, wasting water and harming root health
- **Under-watering** — neglect caused by uncertainty about plant species requirements

Additionally, plant diseases that go undetected spread to healthy plants, increasing chemical treatment use and eventual plant loss — both of which carry environmental costs.

There is a meaningful opportunity for AI to shift plant care from calendar-based routines to condition-aware, data-driven decisions.

---

## 3. Motivation

The project was motivated by three converging observations:

1. Consumer-grade camera hardware (smartphones) is now sufficient for reliable computer vision tasks such as species identification and visual disease detection.
2. Large language models can translate technical diagnostic output into plain-language guidance accessible to non-experts.
3. Live weather data is freely available and can make watering recommendations meaningfully more accurate than fixed schedules.

PlantCare combines these three capabilities into a single, accessible application.

---

## 4. Target Users

| User Segment | Description |
|---|---|
| Home gardeners | People who keep houseplants, balcony plants, or small kitchen gardens without professional training |
| Urban farmers | Small-scale growers in cities who want to minimise water and chemical use |
| Sustainability-conscious consumers | Users motivated by reducing their environmental footprint in everyday activities |
| Beginner plant enthusiasts | People who recently started caring for plants and lack identification or care knowledge |

---

## 5. User Pain Points

- "I don't know what plant this is or what it needs."
- "I can't tell if this yellowing leaf is normal or a disease."
- "I water on the same schedule regardless of weather — I know this wastes water."
- "I don't know what to do after I notice something wrong with my plant."
- "I've killed several plants and don't understand why."

---

## 6. Solution Concept

PlantCare provides an AI-assisted, weather-aware plant health companion:

1. The user uploads a photo of their plant.
2. The app identifies the plant species using computer vision (PlantNet API).
3. A pretrained vision model analyses the image for leaf diseases.
4. An LLM translates the technical result into practical, plain-language care advice.
5. Live weather data (temperature, humidity, rain probability) informs a rule-based watering recommendation.
6. All interactions are logged and contribute to a sustainability score that tracks water saved, plants monitored, and diseases caught early.

---

## 7. Value Proposition

> **PlantCare helps everyday plant owners keep their plants healthier while using less water — guided by AI that understands their plant, their local weather, and their plant's condition.**

The key differentiation from a generic plant encyclopedia or reminder app is the combination of:

- **Personalisation** — results are specific to the user's actual plant and local conditions
- **Actionability** — recommendations are concrete steps, not general advice
- **Sustainability framing** — water savings and early disease detection are tracked and made visible
- **Conversational follow-up** — users can ask natural-language questions about their specific plant

---

## 8. Why AI Is Useful Here

| AI Capability | Application in PlantCare |
|---|---|
| Computer vision (image classification) | Species identification and leaf disease detection from a single photo |
| Large language models | Plain-language explanation of technical disease labels; follow-up Q&A |
| Context-aware reasoning | The LLM receives plant name, disease label, health status, and weather as context — producing advice that is specific, not generic |

AI removes the requirement for botanical expertise from the user. The user only needs to take a photo.

---

## 9. Why Weather Intelligence Is Useful

Fixed watering schedules ignore the most important variable: current conditions. A plant that needs water on a hot, dry day does not need water when 50% rain probability is forecast and humidity is already above 60%.

PlantCare fetches live temperature, humidity, and next-period rain probability from OpenWeatherMap, then applies rule-based logic to give a contextually accurate recommendation. This prevents unnecessary watering events — the most direct water-saving mechanism the app provides.

---

## 10. Why Sustainability Tracking Is Useful

Sustainability tracking serves two purposes:

1. **Behavioural feedback** — users can see the estimated cumulative impact of their app-guided decisions, which reinforces continued use and attention to plant health.
2. **Progress visibility** — a score out of 100 gives a simple, understandable representation of aggregate behaviour.

> **Honest caveat**: PlantCare's sustainability metrics are application-level estimates based on rule-defined thresholds, not scientifically measured environmental data. They reflect app engagement patterns as a proxy for sustainable behaviour, not independently verified real-world impact. The codebase explicitly acknowledges this in comments within `sustainability_service.py`.

---

## 11. Core Features

| Feature | Implementation Status | Confirmed from Repository |
|---|---|---|
| Plant species identification | ✅ Implemented | PlantNet API integration confirmed |
| Leaf disease detection | ✅ Implemented | Hugging Face ViT model (`wambugu71/crop_leaf_diseases_vit`) confirmed |
| AI Plant Doctor explanation | ✅ Implemented | Groq async client confirmed |
| Follow-up Q&A | ✅ Implemented | `/plants/ask` endpoint confirmed |
| Weather fetch | ✅ Implemented | OpenWeatherMap current + forecast confirmed |
| Weather-aware watering rules | ✅ Implemented | 4-rule engine confirmed in `watering_service.py` |
| Diagnosis saving to database | ✅ Implemented | Supabase insert confirmed |
| Watering log persistence | ✅ Implemented | `watering_logs` table confirmed |
| Sustainability score | ✅ Implemented | Weighted formula confirmed |
| Dashboard with charts | ✅ Implemented | Recharts LineChart and PieChart confirmed |
| User authentication | ✅ Implemented | Supabase JWT auth confirmed |

---

## 12. Differentiators

Compared to a generic plant encyclopedia app or a simple image classifier:

- **Disease detection + identification in a single upload** — the image is sent to both PlantNet and the disease model in parallel
- **LLM that receives real context** — the AI Doctor is not a generic chatbot; it receives the specific plant name, disease label, and live weather conditions
- **Water conservation built into the core loop** — watering advice is not a secondary feature; it is part of every session
- **Sustainability score as a retention mechanism** — gamified sustainability encourages repeated use
- **Persistent history** — authenticated users build a record of their plants and diagnoses over time

---

## 13. Real-World Application Scenarios

| Scenario | PlantCare Response |
|---|---|
| User photographs an unknown houseplant | Identifies species, common name, confidence score |
| User notices yellowing leaves | Disease check flags potential nutrient deficiency or early blight |
| It rained yesterday; user wonders if watering is needed | Weather check shows high humidity + recent rain; recommends skipping |
| User wants to understand what "early blight" means for their tomato | AI Doctor explains in plain language with 2–3 care steps |
| User asks "can I use neem oil for this?" | Follow-up Q&A answers with plant-specific advice |

---

## 14. Assumptions

- Users have a smartphone or camera-enabled device.
- Users are willing to share geolocation for weather data.
- The PlantNet API can identify common garden plants with sufficient accuracy for practical guidance.
- The ViT disease model (`wambugu71/crop_leaf_diseases_vit`) performs adequately on the crop types it was trained on; its accuracy on unusual or uncommon plants is unknown.
- Estimated water savings are directionally meaningful even if not precisely measured.

---

## 15. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Disease model misclassifies | Medium | Confidence score displayed; AI Doctor provides context |
| PlantNet cannot identify unusual plant | Medium | 404 handled gracefully; user notified |
| Weather service unavailable | Low | Watering check still runs with user-provided data; graceful error shown |
| LLM response is generic or unhelpful | Low | Temperature set to 0.4; rich context passed in prompt |
| Users treat sustainability score as scientifically accurate | Medium | Labelling should clarify "estimated" |

---

## 16. Limitations

- The disease model is limited to crop/leaf diseases in its training set; ornamental or exotic plants may be misclassified.
- Water savings are estimated from per-plant baseline values (e.g., tomato: 0.5L, basil: 0.2L) — not measured from actual irrigation hardware.
- There is no push notification or reminder system (noted as a future improvement in the README).
- The app currently uses a fixed rule-based watering engine; it does not learn from individual plant history.
- The LLM model in the code (`openai/gpt-oss-120b`) differs from the Llama 3.3 70B model described in the README — the implementation is the ground truth.

---

## 17. Future Opportunities

- **Soil moisture sensor integration** — real sensor data would make watering recommendations significantly more accurate
- **Fine-tuned disease model** — training on a broader, project-specific dataset would improve accuracy across plant types
- **Personalised care schedules** — combining plant history, weather patterns, and observed health to generate adaptive schedules
- **Push/email watering reminders** — noted in the README
- **Multi-plant dashboard** — tracking a collection of different plants with individual health timelines
- **Community disease reports** — aggregating anonymised data to identify regional disease outbreaks
- **Carbon footprint tracking** — estimating transport-related emissions from plant sourcing as an extension of the sustainability angle
