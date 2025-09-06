# app/Routes/summarizer.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.Service.Summarizer import (
    generate_paragraph,
    generate_bullets,
    generate_highlights,
)
from app.Utiles.GetArticle import get_article
import random

router = APIRouter()


# -----------------------------
# Request Schema
# -----------------------------
class SummarizerRequest(BaseModel):
    topic: Optional[str] = None
    url: Optional[str] = None
    format: str  # "paragraph" | "bulletPoint" | "keyHighlight"


# -----------------------------
# Response Schema
# -----------------------------
class SummaryResponse(BaseModel):
    summary: str | List[str]
    wordCount: int
    readingTime: str


# -----------------------------
# Validation
# -----------------------------
def validate_inputs(data: SummarizerRequest):
    if not data.topic and not data.url:
        raise HTTPException(status_code=400, detail="Provide either a topic or a URL.")


# -----------------------------
# Utility Functions
# -----------------------------
def estimate_reading_time(text: str | List[str]) -> str:
    if isinstance(text, list):
        words = sum(len(s.split()) for s in text)
    else:
        words = len(text.split())

    seconds = words / 3.5  # ~200 wpm
    if seconds < 60:
        return f"{int(seconds)} seconds"
    return f"{round(seconds/60, 1)} minutes"


# -----------------------------
# Main Route
# -----------------------------
@router.post("/summarizer", response_model=SummaryResponse, summary="Summarize news in various formats")
async def summarize(request: SummarizerRequest):
    validate_inputs(request)
    cleaned_news = get_article(request.topic, request.url)

    # Choose summarization format
    if request.format == "paragraph":
        result = generate_paragraph(cleaned_news)
    elif request.format == "bulletPoint":
        result = generate_bullets(cleaned_news)
    elif request.format == "keyHighlight":
        result = generate_highlights(cleaned_news)
    else:
        raise HTTPException(status_code=400, detail="Invalid format type.")

    # Prepare structured response
    if isinstance(result, list):
        word_count = sum(len(r.split()) for r in result)
        summary_out = result
    else:
        word_count = len(result.split())
        summary_out = result

    response = SummaryResponse(
        summary=summary_out,
        wordCount=word_count,
        readingTime=estimate_reading_time(result),
    )

    return response
