# app/Router/translate_router.py
from fastapi import APIRouter, Body, HTTPException
from app.Service.Translate import generate_translation, detect_language
from app.Utiles.GetArticle import get_article
import time

router = APIRouter()

@router.post("/translate", summary="Translate article from topic or URL")
async def translate(
    topic: str = Body(default=None, description="Topic to search news for"),
    url: str = Body(default=None, description="URL of the news article"),
    language: str = Body(..., embed=True, description="Target translation language")
):
    try:
        # Load source text
        article = get_article(topic=topic, url=url)
        if not article or not article.strip():
            raise HTTPException(status_code=400, detail="No article content found.")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Article fetch failed: {str(e)}")

    # Measure processing time
    start = time.time()

    # Step 1: Detect source language using LLM
    detected_language = detect_language(article)

    # Step 2: Translate into target
    translated = generate_translation(article, language)

    end = time.time()

    if not translated.strip():
        raise HTTPException(status_code=500, detail="Translation failed or returned empty output.")

    return {
        "translatedText": translated.strip(),
        "originalLength": len(article),
        "translatedLength": len(translated),
        "detectedLanguage": detected_language,
        "targetLanguage": language.capitalize(),
        "processingTime": f"{round(end - start, 2)}s",
    }
