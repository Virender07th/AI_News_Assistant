# app/Service/FetchNews.py
from typing import List, Dict, Optional, Literal
import os
import json
import re
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain_tavily import TavilySearch
from pydantic import BaseModel, HttpUrl

# Load environment variables
load_dotenv()

# Initialize components
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
parser = StrOutputParser()

# ==================== TAVILY SEARCH SETUP ====================

def create_tavily_client():
    """Create Tavily client with error handling"""
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return None
    
    try:
        return TavilySearch(
            api_key=api_key,
            max_results=10,
            topic="news",
            include_answer=False,
            include_raw_content=False,
            include_images=True
        )
    except Exception:
        return None

tavily_client = create_tavily_client()

def safe_extract_tavily_results(data, max_items: int = 10) -> List[Dict]:
    """Safely extract results from Tavily response"""
    if not data:
        return []
    
    if isinstance(data, list):
        return [item for item in data[:max_items] if isinstance(item, dict)]
    
    if isinstance(data, dict):
        for key in ['results', 'data', 'items']:
            if key in data and isinstance(data[key], list):
                return safe_extract_tavily_results(data[key], max_items)
        
        if any(key in data for key in ['url', 'title', 'content']):
            return [data]
    
    return []

def extract_image(result: Dict) -> str:
    """Extract image from Tavily result with fallbacks"""
    if not isinstance(result, dict):
        return "https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}"
    
    for key in ["image", "thumbnail", "img", "image_url"]:
        if result.get(key):
            return str(result[key])
    
    if isinstance(result.get("images"), list) and result["images"]:
        return str(result["images"][0])
    
    return "https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}"

def search_news_articles(query: str, num_results: int = 10) -> List[Dict]:
    """Search for news articles using Tavily"""
    if not tavily_client or not query.strip():
        return []
    
    try:
        news_query = f"{query.strip()} news recent articles"
        
        raw_results = None
        for method in ['invoke', 'run']:
            try:
                if method == 'invoke':
                    raw_results = tavily_client.invoke({"query": news_query})
                else:
                    raw_results = tavily_client.run(news_query)
                
                if raw_results:
                    break
            except Exception:
                continue
        
        if not raw_results:
            return []
        
        results_list = safe_extract_tavily_results(raw_results, num_results)
        formatted_results = []
        
        for i, result in enumerate(results_list):
            if not isinstance(result, dict):
                continue
            
            title = str(result.get("title") or f"News Article {i+1}")[:200]
            url = str(result.get("url") or "https://example.com")
            content = str(result.get("content") or result.get("snippet") or "")[:1000]
            image = extract_image(result)
            
            formatted_results.append({
                "title": title,
                "url": url,
                "content": content,
                "image": image
            })
        
        return formatted_results[:num_results]
    
    except Exception as e:
        print(f"Tavily search error: {e}")
        return []

# ==================== PYDANTIC MODELS ====================

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

# ==================== LLM PROCESSING ====================

news_enhancement_prompt = PromptTemplate.from_template("""
You are an expert news analyst. Transform the raw search results into compelling news articles.

SEARCH RESULTS:
{search_results}

USER INTERESTS: {interests}
NUMBER OF ARTICLES: {num_articles}

Return ONLY a valid JSON object in this exact format:
{{
  "articles": [
    {{
      "heading": "Compelling headline that draws attention",
      "title": "Clean, informative title", 
      "description": "Detailed 2-3 sentence description with key information",
      "tone": "Positive|Negative|Neutral",
      "category": "AI|Technology|Business|Politics|Sports|Health|Science|Entertainment|Climate|Space|Legal",
      "author": "Author name or 'Staff Reporter'",
      "publisher": "Publisher name",
      "source": "Source publication name"
    }}
  ]
}}

Return only valid JSON, no markdown or extra text.
""")

news_enhancement_chain = news_enhancement_prompt | llm | parser

def extract_domain_name(url: str) -> str:
    """Extract clean domain name from URL"""
    try:
        from urllib.parse import urlparse
        domain = urlparse(url).netloc.replace('www.', '')
        return domain.split('.')[0].title()
    except:
        return "News Source"

def generate_enhanced_articles(search_results: List[Dict], interests: Optional[List[str]] = None, num_articles: int = 3) -> List[EnhancedArticleItem]:
    """Generate enhanced articles using LLM and metadata processing"""
    if not search_results:
        raise ValueError("No search results available for processing")
    
    try:
        limited_results = search_results[:num_articles]
        formatted_results = []
        
        for result in limited_results:
            formatted_results.append({
                'title': result.get('title', '')[:200],
                'content': result.get('content', '')[:800],
                'url': result.get('url', ''),
                'image': extract_image(result)
            })
        
        raw_output = news_enhancement_chain.invoke({
            "search_results": json.dumps(formatted_results, indent=2),
            "interests": ", ".join(interests) if interests else "general news",
            "num_articles": num_articles
        })
        
        # Parse JSON response
        json_match = re.search(r"```(?:json)?\s*({.*})\s*```", raw_output, re.DOTALL)
        if json_match:
            json_str = json_match.group(1).strip()
        else:
            json_start = raw_output.find('{')
            json_end = raw_output.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = raw_output[json_start:json_end]
            else:
                raise ValueError("No valid JSON found in LLM response")
        
        parsed_data = json.loads(json_str)
        articles_data = parsed_data.get('articles', [])
        
        if not articles_data:
            raise ValueError("No articles found in LLM response")
        
        # Generate enhanced article objects
        enhanced_articles = []
        for i, (article_data, search_result) in enumerate(zip(articles_data, limited_results), 1):
            current_time = datetime.now()
            hours_ago = random.randint(1, 24)
            published_time = current_time - timedelta(hours=hours_ago)
            
            if hours_ago < 24:
                published_at = f"{hours_ago} hour{'s' if hours_ago > 1 else ''} ago"
            else:
                days_ago = hours_ago // 24
                published_at = f"{days_ago} day{'s' if days_ago > 1 else ''} ago"
            
            url = search_result.get('url', 'https://example.com')
            domain_name = extract_domain_name(url)
            image = extract_image(search_result)
            
            if not article_data.get('title'):
                article_data['title'] = search_result.get('title', f'News Article {i}')
            if not article_data.get('description'):
                article_data['description'] = search_result.get('content', '')[:300] + '...'
            
            enhanced_article = EnhancedArticleItem(
                id=i,
                heading=article_data.get('heading', article_data.get('title', 'Breaking News')),
                title=article_data.get('title', 'News Update'),
                description=article_data.get('description', 'No description available.'),
                image=image,
                tone=article_data.get('tone', 'Neutral'),
                category=article_data.get('category', 'Technology'),
                publisher=article_data.get('publisher', domain_name),
                source=article_data.get('source', domain_name),
                publishedAt=published_at,
                url=url
            )
            enhanced_articles.append(enhanced_article)
        
        return enhanced_articles[:num_articles]
    
    except Exception as e:
        print(f"Article enhancement error: {e}")
        raise ValueError(f"Failed to process articles: {str(e)}")
