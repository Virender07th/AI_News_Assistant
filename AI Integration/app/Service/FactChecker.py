# app/Service/AINewsProjectService/FactChecker.py

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from pydantic import BaseModel, HttpUrl
from typing import List, Literal
import os, json, re

# Load environment variables
load_dotenv()

# Initialize LLM & Parser
llm = ChatGroq(model="llama3-70b-8192", temperature=0.2)
parser = StrOutputParser()

# ------------------ ✅ Pydantic Output Schema ------------------ #
class Source(BaseModel):
    title: str
    url: HttpUrl

class FactCheckReport(BaseModel):
    verdict: Literal["True", "False", "Misleading"]
    reasoning: str
    sources: List[Source]
    cleaned_markdown: str
    is_simulated: bool = True  # flag for demo mode vs real API

# ------------------ ✅ Prompt Template ------------------ #
fact_check_prompt = PromptTemplate.from_template(
    """
You are an expert AI assistant specialized in media fact-checking and journalistic verification.

Your task is to analyze the given news article and return a structured fact-checking report in **pure JSON** format (no markdown formatting, backticks, or extra text).

---

## Output Format:

{{
  "verdict": "True" | "False" | "Misleading",
  "reasoning": "Concise explanation based on verified facts and evidence.",
  "sources": [
    {{
      "title": "Source Title 1",
      "url": "https://example.com/source1"
    }},
    {{
      "title": "Source Title 2",
      "url": "https://example.com/source2"
    }}
  ],
  "cleaned_markdown": "### Verdict: True\\n\\nExplanation of why the article is accurate. Bullet points, emphasis, and source links in markdown.",
  "is_simulated": true
}}

---

Only return the JSON object above. Do not include triple backticks or extra commentary.

---

## Input Article:
{article}
"""
)

# ------------------ ✅ LangChain Chain ------------------ #
fact_check_chain = fact_check_prompt | llm | parser

# ------------------ ✅ Handler Function ------------------ #
def generate_fact_check(article: str) -> FactCheckReport:
    raw_output = fact_check_chain.invoke({"article": article})

    # Optional: print partial output for debugging
    print("\n[LLM OUTPUT SAMPLE]\n", raw_output[:1000], "\n")

    # Clean LLM output (remove backticks and code blocks)
    match = re.search(r"```json(.*?)```", raw_output, re.DOTALL)
    json_str = match.group(1).strip() if match else raw_output.strip()

    try:
        data = json.loads(json_str)
        return FactCheckReport(**data)
    except Exception as e:
        raise ValueError(f"[FactChecker] Invalid JSON from LLM:\n{e}\n\nRaw JSON:\n{json_str}")
