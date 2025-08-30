from fastapi import APIRouter, Body, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from app.Service.Summarizer import (
    generate_paragraph,
    generate_bullets,
    generate_highlights,
)
from app.Utiles.GetArticle import get_article

router = APIRouter()

class SummarizerRequest(BaseModel):
    topic: Optional[str] = None
    url: Optional[str] = None

def validate_inputs(data: SummarizerRequest):
    if not data.topic and not data.url:
        raise HTTPException(status_code=400, detail="Provide either a topic or a URL.")

@router.post("/para", summary="Summarize news into one paragraph")
async def summarize_paragraph(request: SummarizerRequest):
    validate_inputs(request)
    cleaned_news = get_article(request.topic, request.url)
    summary = generate_paragraph(cleaned_news)
    return {"paragraph": summary}

@router.post("/bullets", summary="Summarize news into bullet points")
async def summarize_bullets(request: SummarizerRequest):
    validate_inputs(request)
    cleaned_news = get_article(request.topic, request.url)
    summary = generate_bullets(cleaned_news)
    return {"bullets": summary}

@router.post("/highlight", summary="Extract key highlights from news")
async def summarize_highlights(request: SummarizerRequest):
    validate_inputs(request)
    cleaned_news = get_article(request.topic, request.url)
    summary = generate_highlights(cleaned_news)
    return {"highlights": summary}
