from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# AI News Project routers
from app.Router.Summarize_router import router as summarize_router
from app.Router.Translate_router import router as translate_router
from app.Router.NewsArticleFetch_router import router as news_article_fetch_router
from app.Router.FactChecker_router import router as fact_checker_router
from app.Router.BiasDetection_router import router as bias_detection_router
from app.Router.FetchNews_router import router as fetch_news_router

# Future: AI All Docx Project routers go here

app = FastAPI()

# ✅ Add all origins you need for dev + prod
origins = [
    "https://ai-news-assistant-2-7q8g.onrender.com",
    "https://ai-journalist-agent.vercel.app",
    "http://localhost:8000/api/v1",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(summarize_router, prefix="/api")
app.include_router(translate_router, prefix="/api")
app.include_router(news_article_fetch_router, prefix="/api")
app.include_router(fact_checker_router, prefix="/api")
app.include_router(bias_detection_router, prefix="/api")
app.include_router(fetch_news_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "FastAPI is working 🚀"}
