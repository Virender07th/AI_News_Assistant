import re
import json
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Dict, List

load_dotenv()

# ----------------- Pydantic Models -----------------
class BiasData(BaseModel):
    overallScore: int
    categories: Dict[str, int]
    keyPhrases: List[str]
    sentiment: str
    confidence: int

class BiasDetectionResponse(BaseModel):
    biasData: BiasData
    bias_progress: int
    is_simulated: bool = False

# ----------------- LangChain / LLM Setup -----------------
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
parser = StrOutputParser()

bias_Detect_prompt = PromptTemplate.from_template(
"""
You are an expert AI assistant in journalistic standards and bias detection.

Analyze the following article and return a **valid JSON object** compatible with this format:

{{
  "biasData": {{
    "overallScore": int,
    "categories": {{
      "category_name_1": int,
      "category_name_2": int,
      "category_name_3": int,
      "additional_categories_as_needed": int
    }},
    "keyPhrases": [string_array],
    "sentiment": string,
    "confidence": int
  }},
  "bias_progress": int
}}

## Analysis Guidelines:

1. **overallScore**: Overall bias score (0-100, where 0=no bias, 100=extremely biased)

2. **categories**: Dynamically identify and score the most relevant bias categories found in this specific article. Common categories include but are not limited to:
   - political: Political bias or partisan lean
   - emotional: Emotional language and charged rhetoric  
   - factual: Factual accuracy and evidence-based reporting (0-100, where 100=highly factual)
   - sensational: Sensationalized or clickbait language
   - commercial: Commercial or corporate bias
   - cultural: Cultural or social bias
   - geographical: Regional or national bias
   - temporal: Temporal bias (focusing on recent vs historical context)
   - source: Source selection bias
   - confirmation: Confirmation bias (cherry-picking supporting evidence)
   
   **Important**: Only include categories that are actually relevant to the article content. Each category should be scored 0-100.

3. **keyPhrases**: Array of 3-6 key biased phrases, loaded language, or emotionally charged terms actually found in the article

4. **sentiment**: Overall sentiment like "neutral", "slightly positive", "negative", "strongly positive", "slightly negative", "strongly negative"

5. **confidence**: Your confidence in this analysis (0-100)

6. **bias_progress**: Same value as overallScore for compatibility

Focus on detecting:
- Loaded or emotionally charged language
- One-sided presentation of facts
- Missing context or opposing viewpoints
- Sensationalized headlines or claims
- Political lean or agenda
- Commercial interests
- Cultural assumptions
- Source credibility issues

**Important**: Analyze the actual content and only identify bias categories that are genuinely present. Don't force categories that don't apply.

Return ONLY the JSON object, no additional text or formatting.

Article:
{article}
"""
)

bias_detection_chain = bias_Detect_prompt | llm | parser

# ----------------- LLM Processing -----------------
def generate_bias_detection(article: str) -> BiasDetectionResponse:
    raw_output = bias_detection_chain.invoke({"article": article})
    
    # Extract JSON from ```json code block if present
    match = re.search(r"```json(.*?)```", raw_output, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
    else:
        json_str = raw_output.strip()

    try:
        data = json.loads(json_str)
        return BiasDetectionResponse(**data)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Raw LLM Output: {raw_output}")
        # Return a fallback response
        return BiasDetectionResponse(
            biasData=BiasData(
                overallScore=50,
                categories={"political": 40, "emotional": 45, "factual": 70},
                keyPhrases=["analysis unavailable", "processing error"],
                sentiment="neutral",
                confidence=30
            ),
            bias_progress=50,
            is_simulated=True
        )
    except Exception as e:
        print(f"General Error: {e}")
        raise ValueError(f"Error processing bias detection: {e}")