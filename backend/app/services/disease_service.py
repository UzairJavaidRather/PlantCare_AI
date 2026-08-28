import io
from PIL import Image
from transformers import pipeline

_classifier = None


def get_classifier():
    """Load the model once, reuse it for every request (loading it per-request would be extremely slow)."""
    global _classifier
    if _classifier is None:
        _classifier = pipeline(
            "image-classification",
            model="wambugu71/crop_leaf_diseases_vit"
        )
    return _classifier


def detect_disease(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    classifier = get_classifier()
    predictions = classifier(image)  

    top = predictions[0]
    label = top["label"]
    confidence = round(top["score"] * 100, 1)
    is_healthy = "healthy" in label.lower()

    return {
        "label": label,
        "is_healthy": is_healthy,
        "confidence": confidence,
    }