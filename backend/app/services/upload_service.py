import os
import uuid
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "uploads"
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = 5

os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_upload(file: UploadFile) -> dict:
    # Validate content type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Use JPEG, PNG, or WEBP."
        )

    # Read the file into memory to check size and save it
    contents = await file.read()
    size_kb = len(contents) / 1024

    if size_kb > MAX_SIZE_MB * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size_kb / 1024:.1f} MB). Max is {MAX_SIZE_MB} MB."
        )

    # Generate a unique filename so two users' "leaf.jpg" never collide
    ext = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, unique_name)

    with open(filepath, "wb") as f:
        f.write(contents)

    return {
        "filename": unique_name,
        "content_type": file.content_type,
        "size_kb": round(size_kb, 1),
        "filepath": filepath,
    }