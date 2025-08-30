# app/Router/translate_router.py

from fastapi import APIRouter, Body, HTTPException
from app.Service.FactChecker import generate_fact_check
from app.Utiles.GetArticle import get_article# Your Pydantic model

router = APIRouter()

@router.post("/fact-check" ,summary="Fact Check for a news article from topic or URL")
async def fact_Checker(
    topic: str = Body(default=None, description="Topic to search news for"),
    url: str = Body(default=None, description="URL of the news article"),
):
    try:
        article = get_article(topic=topic, url=url)
        result = generate_fact_check(article)
        return result  # result is a Pydantic model, returned directly
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
