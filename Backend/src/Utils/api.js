// const FASTAPI_BASE_URL = "http://127.0.0.1:8000/api"
 const FASTAPI_BASE_URL ="https://ai-news-assistant-6gwu.onrender.com/api"


// all post
export const AiEndpoints = {
    FETCH_NEWS_API :FASTAPI_BASE_URL + "/fetch-news",
    FACT_CHECKER_API :FASTAPI_BASE_URL + "/fact-check",
    BIAS_DETECTION_API : FASTAPI_BASE_URL + "/bias_detection",
    SUMMARIZER_API:FASTAPI_BASE_URL + "/summarizer",
    TRANSLATE_API :FASTAPI_BASE_URL + "/translate",
    NEWS_ARTICLE_GENERATE_API:FASTAPI_BASE_URL + "/generate-news",
}