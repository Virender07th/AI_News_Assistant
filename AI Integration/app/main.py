from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Ai-News-Project
from app.Router.Summarize_router import router as summarize_route
from app.Router.Translate_router import router as translate_route
from app.Router.NewsArticleFetch_router import router as newsArticleFetch_router
from app.Router.FactChecker_router import router as factChecker_router
from app.Router.BiasDetection_router import router as bias_Detection_router
from app.Router.FetchNews_router import router as fetchNews_router




#Ai-All-Docx-Project


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# AI NEWS 
app.include_router(summarize_route, prefix="/api/summarizer") 
app.include_router(translate_route , prefix="/api")
app.include_router(newsArticleFetch_router , prefix="/api" )
app.include_router(factChecker_router , prefix="/api" )
app.include_router(bias_Detection_router , prefix="/api" )
app.include_router(fetchNews_router , prefix="/api" )

@app.get("/")
def read_root():
    return {"message": "FastAPI is working"}
