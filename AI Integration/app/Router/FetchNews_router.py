# app/routes/news.py
from fastapi import APIRouter, Body, HTTPException
from app.Utiles.GetArticle import get_article
from app.Service.FetchNews import search_news_articles, generate_enhanced_articles
from typing import List, Optional, Literal
from pydantic import BaseModel, HttpUrl

router = APIRouter()

class EnhancedArticleItem(BaseModel):
    id: int
    heading: str
    title: str
    description: str
    image: str
    tone: Literal["Positive", "Negative", "Neutral"] = "Neutral"
    category: str
    publisher: str
    source: str
    publishedAt: str
    url: HttpUrl

class EnhancedArticleList(BaseModel):
    articles: List[EnhancedArticleItem]
    
@router.post("/fetch-news", response_model=EnhancedArticleList, summary="Fetch AI-enhanced news articles")
async def fetch_news(
    topic: Optional[str] = Body(default=None, description="Topic to search news for"),
    url: Optional[str] = Body(default=None, description="Specific news article URL"),
    interests: Optional[List[str]] = Body(default=None, description="User interests/categories for filtering"),
    num_articles: int = Body(default=3, ge=1, le=10, description="Number of articles to fetch (1-10)")
):
    """
    Fetch and enhance news articles using Tavily search and AI processing
    """
    try:
        # Input validation
        if not topic and not url:
            raise HTTPException(status_code=400, detail="Provide either a topic or a valid URL")
        
        # Validate inputs
        if topic == "string" or (topic and len(topic.strip()) < 2):
            topic = None
        if url == "string" or (url and not url.startswith(('http://', 'https://'))):
            url = None
        
        if not topic and not url:
            raise HTTPException(status_code=400, detail="Please provide a valid topic or URL")
        
        # Determine search query
        search_query = ""
        if url:
            try:
                extracted_content = get_article(topic=None, url=url)
                if extracted_content and len(extracted_content.strip()) > 20:
                    search_query = extracted_content[:200]
                else:
                    search_query = topic or "latest news"
            except Exception as e:
                print(f"URL extraction failed: {e}")
                search_query = topic or "latest news"
        else:
            search_query = topic
        
        # Add interest-based keywords to search query
        if interests:
            interest_keywords = " ".join([interest.lower() for interest in interests if interest.lower() != "string"])
            search_query = f"{search_query} {interest_keywords}"
        
        # Search for articles
        search_results = search_news_articles(search_query, num_results=min(num_articles * 2, 20))
        
        if not search_results:
            raise HTTPException(status_code=404, detail="No news articles found for the given query")
        
        # Generate enhanced articles
        enhanced_articles = generate_enhanced_articles(
            search_results=search_results,
            interests=interests,
            num_articles=num_articles
        )
        
        if not enhanced_articles:
            raise HTTPException(status_code=500, detail="Failed to process news articles")
        
        return EnhancedArticleList(
            articles=[article.dict() for article in enhanced_articles]
        )
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Fetch news error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")