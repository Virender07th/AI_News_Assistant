# app/Router/translate_router.py
from fastapi import APIRouter, Body, HTTPException
from app.Service.Translate import generate_translation
from app.Utiles.GetArticle import get_article # Use shared loader function

router = APIRouter()

@router.post("/translate", summary="Translate article from topic or URL")
async def translate(
    topic: str = Body(default=None, description="Topic to search news for"),
    url: str = Body(default=None, description="URL of the news article"),
    language: str = Body(..., embed=True, description="Target translation language")
):
    try:
        article = get_article(topic=topic, url=url)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    translated = generate_translation(article, language)

    if not translated.strip():
        raise HTTPException(status_code=500, detail="Translation failed or returned empty output.")

    return {
        "translated": f"🌐 Translation in **{language}**:\n\n{translated}"
    }
