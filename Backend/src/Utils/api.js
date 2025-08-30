const FASTAPI_BASE_URL = "http://127.0.0.1:8000/api"

// all post
export const AiEndpoints = {
    FETCH_NEWS_API :FASTAPI_BASE_URL + "/fetch-news",
    FACT_CHECKER_API :FASTAPI_BASE_URL + "/fact-check",
    BIAS_DETECTION_API : FASTAPI_BASE_URL + "/bias_detection",
    PARAGRAPH_SUMMARIZE_API:FASTAPI_BASE_URL + "/summarizer/para",
    BULLETS_SUMMARIZE_API:FASTAPI_BASE_URL + "/summarizer/bullets",
    HIGHLIGHT_SUMMARIZE_API:FASTAPI_BASE_URL + "/summarizer/highlight",
    TRANSLATE_API :FASTAPI_BASE_URL + "/translate",
    NEWS_ARTICLE_GENERATE_API:FASTAPI_BASE_URL + "/generate-news",
}