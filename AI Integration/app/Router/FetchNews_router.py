from fastapi import APIRouter, Body, HTTPException
from app.Utiles.GetArticle import get_article
from app.Service.FetchNews import generate_fetch_news_article
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import os
import json

from langchain_tavily import TavilySearch

router = APIRouter()

class ArticleItem(BaseModel):
    title: str
    url: HttpUrl
    snippet: str
    category: str

class ArticleList(BaseModel):
    articles: List[ArticleItem]

@router.post("/fetch-news", response_model=ArticleList, summary="Fetch and structure news articles using Tavily + LLM")
async def fetch_news(
    topic: Optional[str] = Body(default=None, description="Topic to search news for"),
    url: Optional[str] = Body(default=None, description="URL of a news article"),
    interest: Optional[List[str]] = Body(default=None, description="Provide categories (e.g., ['sports','politics'])"),
    no_of_article: int = Body(default=3, ge=1, le=10, description="Number of articles to fetch (1–10)")
):
    try:
        if not topic and not url:
            raise HTTPException(status_code=400, detail="Provide either a topic or a valid URL.")

        if url and url != "string":
            query = get_article(topic=None, url=url)
        elif topic:
            query = topic
        else:
            raise HTTPException(status_code=400, detail="Invalid input: Both topic and url are empty or invalid.")

        if interest:
            query += " " + " ".join(interest)

        tavily = TavilySearch(
            max_results=no_of_article,
            topic="news",
            include_answer=False,
            include_raw_content=False,
            include_images=False
        )
        response = tavily.invoke({"query": query})

        if not response or "results" not in response or not response["results"]:
            raise HTTPException(status_code=404, detail="No news articles found.")

        limited_results = response["results"][:no_of_article]
        serialized_input = json.dumps(limited_results, indent=2)

        articles = generate_fetch_news_article(serialized_input, interest)
        return {"articles": [a.dict() for a in articles[:no_of_article]]}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
