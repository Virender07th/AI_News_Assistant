import os
import json
import re
from typing import List, Optional
from dotenv import load_dotenv
from pydantic import BaseModel, HttpUrl

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

load_dotenv()

# ------------------ ✅ LLM Setup ------------------ #
llm = ChatGroq(model="llama3-70b-8192", temperature=0.2)
parser = StrOutputParser()

# ------------------ ✅ Pydantic Schema ------------------ #
class ArticleItem(BaseModel):
    title: str
    url: HttpUrl
    snippet: str
    category: str

class ArticleList(BaseModel):
    articles: List[ArticleItem]

# ------------------ ✅ Prompt Template ------------------ #
fetch_news_articles_prompt = PromptTemplate.from_template(
    """
You are a helpful assistant that generates structured article summaries in JSON format.

Always include the **category** field (choose from the given interests if relevant).

Only return a JSON object in the format below. No extra commentary, no markdown.

Example Format:
{{
  "articles": [
    {{
      "title": "Sample Title",
      "url": "https://example.com/article",
      "snippet": "Brief summary of the article.",
      "category": "technology"
    }}
  ]
}}

Interests (categories): {interests}
Input Articles:
{article}
"""
)

# ------------------ ✅ LangChain Chain ------------------ #
fetch_news_chain = fetch_news_articles_prompt | llm | parser

# ------------------ ✅ LLM Handler ------------------ #
def generate_fetch_news_article(article: str, interests: Optional[List[str]] = None) -> List[ArticleItem]:
    try:
        raw_output = fetch_news_chain.invoke({
            "article": article,
            "interests": ", ".join(interests) if interests else "general"
        })

        print("\n[LLM OUTPUT SAMPLE]\n", raw_output[:1000])

        # Extract JSON if LLM adds code fences
        match = re.search(r"```(?:json)?\s*({.*})\s*```", raw_output, re.DOTALL)
        json_str = match.group(1).strip() if match else raw_output.strip()

        parsed = json.loads(json_str)

        # ✅ Normalize missing fields
        for item in parsed.get("articles", []):
            if not item.get("snippet"):
                item["snippet"] = "No summary available."
            if not item.get("category"):
                item["category"] = "general"

        return [ArticleItem(**a) for a in parsed["articles"]]

    except Exception as e:
        raise ValueError(f"[FetchNews] Invalid JSON from LLM: {e}\n\nRaw Output:\n{raw_output}")
