from fastapi import APIRouter, Body, HTTPException
from app.Utiles.GetArticle import get_article
from app.Service.NewsArticleFetch import newsGeneration

router = APIRouter()

@router.post("/generate-news", summary="Generate a cleaned and formatted news article from a topic or URL")
async def generate_news(
    topic: str = Body(default=None, description="News topic to generate the article from."),
    url: str = Body(default=None, description="URL to extract and clean article content from."),
):
    try:
        # Fetch + clean article
        article = get_article(topic=topic, url=url )

        # Generate news content using GenAI pipeline
        generated_news = newsGeneration(article)

        if not generated_news or not generated_news.strip():
            raise HTTPException(status_code=500, detail="News generation failed or returned empty content.")

        return {
            "status": "success",
            "source": url if url else topic,
            "news": generated_news
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")
