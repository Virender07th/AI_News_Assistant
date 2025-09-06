# app/Router/FactCheckerRouter.py
from fastapi import APIRouter, Body, HTTPException
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from typing import Optional

# Import your services
from app.Service.FactChecker import generate_fact_check
from app.Utiles.GetArticle import get_article

router = APIRouter()

# Request model for better API documentation
class FactCheckRequest(BaseModel):
    topic: Optional[str] = None
    url: Optional[str] = None

@router.post("/fact-check", summary="Fact Check for a news article from topic or URL")
async def fact_checker(request: FactCheckRequest = Body(...)):
    topic = request.topic
    url = request.url
    
    if not topic and not url:
        raise HTTPException(
            status_code=400, 
            detail="Provide either a topic or URL for fact-checking."
        )

    try:
        # Get article content
        print(f"Getting article for topic: {topic}, url: {url}")
        article = get_article(topic=topic, url=url)
        
        # Debug: Check what we got
        print(f"Article type: {type(article)}")
        if hasattr(article, '__len__'):
            print(f"Article length: {len(article)}")
        
        if not article:
            raise HTTPException(
                status_code=404, 
                detail="Article content is empty or could not be parsed"
            )
        
        # Ensure article is a string
        if not isinstance(article, str):
            print(f"Warning: article is not a string, converting from {type(article)}")
            article = str(article)
        
        if len(article.strip()) < 50:  # Very short articles might be errors
            raise HTTPException(
                status_code=404,
                detail="Article content too short - may indicate parsing error"
            )

        print(f"Article preview (first 200 chars): {article[:200]}...")

        # Generate fact-check report using correct parameter order
        result = await run_in_threadpool(
            generate_fact_check,
            article,  # First positional argument
            topic=topic,  # Keyword argument
            url=url  # Keyword argument
        )
        
        return result

    except HTTPException as e:
        # Re-raise HTTP exceptions as-is
        raise e
    except Exception as e:
        # Handle all other exceptions
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )
