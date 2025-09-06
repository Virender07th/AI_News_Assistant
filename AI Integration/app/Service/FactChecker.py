# Production-Ready FactChecker Service
from typing import List, Dict, Optional, Literal
import os
import json
import re
from datetime import datetime
from dotenv import load_dotenv

# LangChain imports
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Initialize LLM
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
parser = StrOutputParser()

# ==================== TAVILY SEARCH ====================

def create_tavily_client():
    """Create Tavily client"""
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return None
    
    try:
        from langchain_tavily import TavilySearch
        return TavilySearch(api_key=api_key)
    except ImportError:
        return None

tavily_client = create_tavily_client()

def safe_extract_results(data, max_items: int = 5) -> List[Dict]:
    """Extract results from Tavily response"""
    if not data:
        return []
    
    # Handle different response types
    if isinstance(data, list):
        return [item for item in data[:max_items] if isinstance(item, dict)]
    
    if isinstance(data, dict):
        # Look for results in common keys
        for key in ['results', 'data', 'items']:
            if key in data:
                return safe_extract_results(data[key], max_items)
        # Single result format
        if 'url' in data or 'title' in data:
            return [data]
    
    return []

def search_for_factcheck(query: str, num_results: int = 5) -> List[Dict]:
    """Search for fact-checking sources using Tavily"""
    if not tavily_client or not query.strip():
        return []
    
    try:
        # Try different Tavily methods
        for method_name in ['run', 'invoke']:
            try:
                if method_name == 'run':
                    raw_results = tavily_client.run(query.strip())
                else:
                    raw_results = tavily_client.invoke({"query": query.strip()})
                
                if raw_results:
                    break
            except Exception:
                continue
        else:
            return []
        
        # Extract and format results
        results_list = safe_extract_results(raw_results, num_results)
        formatted_results = []
        
        for i, result in enumerate(results_list):
            if not isinstance(result, dict):
                continue
            
            # Extract fields
            title = (result.get("title") or result.get("name") or f"Source {i+1}")
            url = (result.get("url") or result.get("link") or "https://example.com")
            content = (result.get("content") or result.get("snippet") or "")
            score = float(result.get("score", 0.0) or 0.0)
            
            formatted_results.append({
                "title": str(title)[:200],
                "url": str(url),
                "credibility": calculate_credibility(url),
                "verified": datetime.now().strftime("%Y-%m-%d"),
                "snippet": str(content)[:500],
                "score": score
            })
        
        return formatted_results
    
    except Exception:
        return []

def calculate_credibility(url: str) -> int:
    """Calculate source credibility based on domain"""
    if not url or url == "https://example.com":
        return 0
    
    url = url.lower()
    
    # Government and educational
    if any(domain in url for domain in [".gov", ".edu", "government"]):
        return 95
    
    # High credibility news
    high_credibility = [
        "reuters.com", "ap.org", "bbc.com", "cnn.com", "nytimes.com",
        "timesofindia.com", "indianexpress.com", "hindustantimes.com", 
        "thehindu.com", "ndtv.com", "news18.com", "washingtonpost.com",
        "guardian.com", "economist.com", "bloomberg.com", "pmc.ncbi.nlm.nih.gov"
    ]
    if any(domain in url for domain in high_credibility):
        return 85
    
    # Medium credibility
    medium_credibility = [
        "abcnews.go.com", "cbsnews.com", "nbcnews.com", "foxnews.com",
        "indiatoday.in", "zeenews.india.com", "firstpost.com"
    ]
    if any(domain in url for domain in medium_credibility):
        return 70
    
    # Academic institutions
    if any(term in url for term in [".ac.", "university", "institute", "research"]):
        return 80
    
    return 60

# ==================== MODELS ====================

class Source(BaseModel):
    title: str
    url: str
    credibility: int
    verified: str

class FactCheckReport(BaseModel):
    verdict: Literal["TRUE", "MOSTLY TRUE", "MIXED", "FALSE"]
    overallScore: int
    confidence: int
    categories: dict
    keyClaims: List[str]
    sources: List[Source]
    reasoning: str
    cleaned_markdown: str
    is_simulated: bool = False

# ==================== FACT CHECKING ====================

fact_check_prompt = PromptTemplate.from_template("""
You are a professional fact-checker AI. Analyze the following article and provide a comprehensive fact-check report.

ARTICLE TO ANALYZE:
{article}

SEARCH CONTEXT:
{search_context}

Provide your analysis as a JSON object with this structure:
{{
  "verdict": "TRUE" | "MOSTLY TRUE" | "MIXED" | "FALSE",
  "overallScore": 0-100,
  "confidence": 0-100,
  "categories": {{
    "factual": 0-100,
    "sourced": 0-100,
    "consistent": 0-100
  }},
  "keyClaims": ["List of 3-5 main factual claims"],
  "sources": [],
  "reasoning": "Brief explanation of verdict",
  "cleaned_markdown": "### Verdict: [VERDICT]\\n\\nSummary of findings.",
  "is_simulated": false
}}

Scoring Guidelines:
- TRUE (90-100): All claims verified and accurate
- MOSTLY TRUE (70-89): Most claims accurate, minor issues
- MIXED (40-69): Some accurate, some questionable claims  
- FALSE (0-39): Major claims inaccurate or misleading

Return ONLY valid JSON.
""")

fact_check_chain = fact_check_prompt | llm | parser

def extract_search_queries(article: str, topic: Optional[str] = None) -> List[str]:
    """Extract search queries from article content"""
    queries = []
    
    # Add topic if provided and valid
    if topic and topic.strip() and topic.strip().lower() != "string":
        queries.append(topic.strip())
    
    # Extract key phrases from article
    if article:
        words = [w for w in article.lower().split() 
                if len(w) > 3 and w.isalpha() and w not in {
                    'this', 'that', 'with', 'from', 'have', 'been', 'were', 
                    'they', 'their', 'there', 'where', 'when', 'what'
                }]
        
        if words:
            queries.append(' '.join(words[:8]))  # Main query
            if len(words) > 8:
                queries.append(' '.join(words[4:12]))  # Secondary query
    
    return queries[:3]

def aggregate_search_results(search_results_list: List[List[Dict]]) -> List[Dict]:
    """Combine and deduplicate search results"""
    seen_urls = set()
    all_results = []
    
    for results in search_results_list:
        for result in results:
            url = result.get('url', '')
            if url and url not in seen_urls and url != "https://example.com":
                seen_urls.add(url)
                all_results.append(result)
    
    # Sort by credibility and score
    all_results.sort(key=lambda x: (x.get('credibility', 0), x.get('score', 0)), reverse=True)
    return all_results[:5]

def create_search_context(search_results: List[Dict]) -> str:
    """Create context string from search results"""
    if not search_results:
        return "No external sources found for verification."
    
    context_parts = []
    for i, result in enumerate(search_results[:3]):
        snippet = result.get('snippet', '')[:200]
        if snippet:
            context_parts.append(f"Source {i+1}: {snippet}")
    
    return '\n'.join(context_parts) if context_parts else "Limited source information available."

def generate_fact_check(article: str, topic: Optional[str] = None, url: Optional[str] = None) -> FactCheckReport:
    """
    Generate comprehensive fact-check report
    """
    try:
        # Validate input
        if not article or len(article.strip()) < 50:
            raise ValueError("Article content too short for analysis")
        
        # Extract search queries
        search_queries = extract_search_queries(article, topic)
        
        # Search for verification sources
        all_search_results = []
        for query in search_queries:
            if query and query.strip():
                results = search_for_factcheck(query, num_results=3)
                if results:
                    all_search_results.append(results)
        
        # Aggregate results
        if all_search_results:
            final_search_results = aggregate_search_results(all_search_results)
            search_context = create_search_context(final_search_results)
        else:
            final_search_results = []
            search_context = "No external verification sources found."
        
        # Generate analysis
        raw_output = fact_check_chain.invoke({
            "article": article,
            "search_context": search_context
        })
        
        # Parse JSON response
        json_match = re.search(r"```json(.*?)```", raw_output, re.DOTALL)
        if json_match:
            json_str = json_match.group(1).strip()
        else:
            json_start = raw_output.find('{')
            json_end = raw_output.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = raw_output[json_start:json_end]
            else:
                raise ValueError("No valid JSON found in response")
        
        data = json.loads(json_str)
        
        # Add sources
        sources = []
        if final_search_results:
            for result in final_search_results:
                sources.append(Source(
                    title=result.get("title", "Unknown Source"),
                    url=result.get("url", "https://example.com"),
                    credibility=result.get("credibility", 60),
                    verified=result.get("verified", datetime.now().strftime("%Y-%m-%d"))
                ))
            data["is_simulated"] = False
        else:
            sources = [Source(
                title="External Verification Unavailable",
                url="https://example.com",
                credibility=0,
                verified=datetime.now().strftime("%Y-%m-%d")
            )]
            data["is_simulated"] = True
            data["confidence"] = min(data.get("confidence", 50), 60)
        
        data["sources"] = [s.dict() for s in sources]
        
        return FactCheckReport(**data)
    
    except Exception as e:
        # Return error fallback
        return FactCheckReport(
            verdict="MIXED",
            overallScore=40,
            confidence=20,
            categories={"factual": 40, "sourced": 20, "consistent": 50},
            keyClaims=["Analysis failed due to technical error"],
            sources=[Source(
                title="Analysis Error",
                url="https://example.com",
                credibility=0,
                verified=datetime.now().strftime("%Y-%m-%d")
            )],
            reasoning="Technical error prevented analysis completion",
            cleaned_markdown="### Technical Error\n\nFact-checking analysis could not be completed.",
            is_simulated=True
        )